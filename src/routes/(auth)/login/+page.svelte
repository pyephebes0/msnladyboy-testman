<script>
  import { goto } from "$app/navigation";

  let email = "";
  let password = "";
  let error = '';

  async function login() {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
 
    if (res.ok) {
			const data = await res.json();
			document.cookie = `token=${data.token}; path=/`; // ✅ Save token in cookie
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
