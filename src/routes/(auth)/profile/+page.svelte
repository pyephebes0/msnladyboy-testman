<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { browser } from '$app/environment';


  let user = null;
  let title = "";
  let content = "";
  let error = "";
  let success = "";

  const getToken = () => {
    if (!browser) return '';
    return document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
  };

  onMount(async () => {
    const token = getToken();
    if (!token) {
      goto('/login');
      return;
    }

    try {
      const res = await fetch("https://urgent-anthia-pyephebes0-bdb76743.koyeb.app/profile", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      // อ่าน body และเก็บข้อมูลในตัวแปร
      const data = await res.json();

      if (res.ok) {
        user = data; // ใช้ข้อมูลที่ได้จาก API
      } else if (res.status === 401) {
        goto("/login");
      } else {
        error = "Failed to load profile";
      }
    } catch (err) {
      error = err.message;
    }
  });

  const createPost = async () => {
    if (!title || !content) {
      error = "กรุณากรอกให้ครบทุกช่อง";
      success = "";
      return;
    }

    try {
      const res = await fetch("https://urgent-anthia-pyephebes0-bdb76743.koyeb.app/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        title = "";
        content = "";
        success = "โพสต์สำเร็จแล้ว!";
        error = "";
      } else {
        const data = await res.json();
        error = data.error || "เกิดข้อผิดพลาด";
        success = "";
      }
    } catch (err) {
      error = "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์";
      success = "";
    }
  };

  function logout() {
    document.cookie = "token=; Max-Age=0";
    goto("/login");
  }
</script>

{#if error}
  <p style="color:red">{error}</p>
{/if}

{#if user}
  <h2>Welcome, {user.username}</h2>
  <p>Email: {user.email}</p>
  <h2>สร้างโพสต์ใหม่</h2>
  {#if error}<p style="color:red">{error}</p>{/if}
  {#if success}<p style="color:green">{success}</p>{/if}
  <form on:submit|preventDefault={createPost}>
    <div>
      <label>หัวข้อโพสต์:</label>
      <input bind:value={title} placeholder="หัวข้อ..." />
    </div>
    <div>
      <label>เนื้อหา:</label>
      <textarea bind:value={content} placeholder="เขียนอะไรบางอย่าง..."
      ></textarea>
    </div>
    <button type="submit">โพสต์</button>
  </form>
{:else}
  <p>กำลังโหลด...</p>
{/if}
