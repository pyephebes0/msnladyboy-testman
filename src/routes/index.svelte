<script>
    import { onMount } from 'svelte';
  
    let posts = [];
  
    async function fetchPosts() {
      const res = await fetch('https://urgent-anthia-pyephebes0-bdb76743.koyeb.app/posts');
      posts = await res.json();
    }
  
    onMount(fetchPosts);
  </script>
  
  <h2>Welcome to the Blog</h2>
  
  <ul>
    {#each posts as post}
      <li>
        <h3>{post.title}</h3>
        <p>{post.content}</p>
      </li>
    {/each}
  </ul>
  