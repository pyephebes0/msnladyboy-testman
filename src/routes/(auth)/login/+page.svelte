<script>
  import { goto } from "$app/navigation";

  let email = "";
  let password = "";
  let error = '';

  async function login() {
    const res = await fetch("https://urgent-anthia-pyephebes0-bdb76743.koyeb.app/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
 
    if (res.ok) {
			goto('/profile'); // ✅ Redirect after login
		} else {
			const errorData = await res.json();
			error = errorData.error || 'Login failed';
		}
  }
</script>

<h2>Login</h2>
<form on:submit|preventDefault={login}>
  <input bind:value={email} placeholder="Email" class="input" />
  <input
    bind:value={password}
    type="password"
    placeholder="Password"
    class="input"
  />
  <button type="submit">Login</button>
</form>

{#if error}
  <p style="color: red">{error}</p>
{/if}
