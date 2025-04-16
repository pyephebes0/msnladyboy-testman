<script>
    let title = '';
    let content = '';
  
    async function submitPost() {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      });
      const data = await res.json();
      console.log(data);
    }
  </script>
  
  <input bind:value={title} placeholder="Title" class="border p-2" />
  <textarea bind:value={content} placeholder="Content" class="border p-2"></textarea>
  <button on:click={submitPost} class="bg-black text-white px-4 py-2">Post</button>
  