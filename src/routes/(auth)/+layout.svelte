<script>
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";

  let isLoggedIn = false;

  const checkLoginStatus = () => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    isLoggedIn = !!token;
  };

  const logout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    isLoggedIn = false;
    goto("/login");
  };

  onMount(() => {
    if (browser) {
      checkLoginStatus();
    }
  });
</script>

<link rel="stylesheet" href="/app.css" />

<!-- Layout Menu -->
<nav class="navbar">
  <ul>
    <li><a href="/">Home</a></li>
    {#if isLoggedIn}
      <li><a href="/profile">Profile</a></li>
      <li><a href="#" on:click={logout}>Logout</a></li>
    {:else}
      <li><a href="/login">Login</a></li>
      <li><a href="/register">Register</a></li>
    {/if}
  </ul>
</nav>

<!-- Body Content -->

<slot />
