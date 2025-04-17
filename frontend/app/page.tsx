'use client'

import { useEffect, useState } from 'react'

type Deal = {
  client: string
  value: number
  status: string
}

type Client = {
  name: string
  industry: string
  contact: string
}

type SalesRep = {
  id: number
  name: string
  role: string
  region: string
  skills: string[]
  deals: Deal[]
  clients: Client[]
}

export default function Home() {
  const [salesReps, setSalesReps] = useState<SalesRep[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  
  // AI feature states
  const [question, setQuestion] = useState("")
  const [aiResponse, setAiResponse] = useState("")

  useEffect(() => {
    fetch('http://localhost:8000/api/sales-reps')
      .then(res => res.json())
      .then(data => {
        setSalesReps(data.salesReps)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError(true)
        setLoading(false)
      })
  }, [])

  const handleAiQuery = async (event: React.FormEvent) => {
    event.preventDefault()

    const response = await fetch('http://localhost:8000/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    })

    const data = await response.json()
    setAiResponse(data.answer)
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error fetching data</p>

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Sales Representatives</h1>
      {salesReps.map(rep => (
        <div key={rep.id} className="border rounded p-4 shadow">
          <h2 className="text-xl font-semibold">{rep.name} ({rep.role})</h2>
          <p>Region: {rep.region}</p>
          <p>Skills: {rep.skills.join(', ')}</p>
          <div className="mt-2">
            <h3 className="font-medium">Deals:</h3>
            <ul className="list-disc ml-6">
              {rep.deals.map((deal, i) => (
                <li key={i}>{deal.client} - ${deal.value} ({deal.status})</li>
              ))}
            </ul>
          </div>
          <div className="mt-2">
            <h3 className="font-medium">Clients:</h3>
            <ul className="list-disc ml-6">
              {rep.clients.map((client, i) => (
                <li key={i}>{client.name} ({client.industry}) - {client.contact}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      <div className="mt-6">
        <h2 className="text-xl font-bold">Ask the AI:</h2>
        <form onSubmit={handleAiQuery}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question..."
            className="p-2 border border-gray-300 rounded"
            required
          />
          <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded">Submit</button>
        </form>
        {aiResponse && (
          <div className="mt-4 p-4 border rounded bg-gray-100">
            <strong>AI Response:</strong>
            <p>{aiResponse}</p>
          </div>
        )}
      </div>
    </div>
  )
}
