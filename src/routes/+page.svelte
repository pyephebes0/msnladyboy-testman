<script>
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";

  let posts = [];
  let q = "";
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

  async function fetchPosts() {
    const res = await fetch(`http://localhost:3000/search?q=${q}`);
    posts = await res.json();
  }

  onMount(fetchPosts);
</script>

<link rel="stylesheet" href="/app.css" />

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

<input bind:value={q} placeholder="Search..." class="border p-2" />
<button on:click={fetchPosts} class="bg-purple-600 text-white px-4 py-2 ml-2"
  >Search</button
>

<ul>
  {#each posts as post}
    <li class="my-4">
      <h2 class="text-xl font-bold">{post.title}</h2>
      <p>{post.content}</p>
    </li>
  {/each}
</ul>
