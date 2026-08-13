import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, saveTokens, API_BASE } from '../api'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      type LoginResponse = {
        accessToken?: string
        access_token?: string
        refreshToken?: string
        refresh_token?: string
      }
      const data = (await api.login(username, password)) as LoginResponse
      console.log('login response', data)
      const access = data?.accessToken || data?.access_token
      const refresh = data?.refreshToken || data?.refresh_token
      if (access) {
        saveTokens({ accessToken: access, refreshToken: refresh })
        navigate('/products')
      } else {
        setError('Invalid server response — no token returned')
      }
    } catch (err: unknown) {
      console.error('login error', err)
      const message = err instanceof Error ? err.message : String(err)
      if (message.includes('Failed to fetch')) {
        setError(`Failed to reach API at ${API_BASE}. Is the mock server running?`)
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={submit}>
        <h1>Product Showcase — Login</h1>
        <label>
          Username
          <input name="username" value={username} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} disabled={loading} />
        </label>
        <label>
          Password
          <input name="password" type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} disabled={loading} />
        </label>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
        <div className="hint"></div>
      </form>
    </div>
  )
}
