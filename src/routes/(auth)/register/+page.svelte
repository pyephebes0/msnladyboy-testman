<script>
  import { goto } from '$app/navigation';

  let username = '';
  let email = '';
  let password = '';
  let error = '';

  async function register(e) {
    e.preventDefault();

    // ตรวจสอบว่าทุกช่องถูกกรอก
    if (!username.trim() || !email.trim() || !password.trim()) {
      error = 'กรุณากรอกข้อมูลให้ครบทุกช่อง';
      return;
    }

    try {
      // สมัครสมาชิก
      const res = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      if (res.ok) {
        // สมัครเสร็จ → login ต่อทันที
        const loginRes = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (loginRes.ok) {
          const data = await loginRes.json();
          document.cookie = `token=${data.token}; path=/;`;

          goto('/profile');
        } else {
          error = 'สมัครสำเร็จ แต่ล็อกอินไม่สำเร็จ';
        }
      } else {
        const errData = await res.json();
        error = errData.error || 'สมัครไม่สำเร็จ';
      }
    } catch (err) {
      error = 'เกิดข้อผิดพลาด: ' + err.message;
    }
  }
</script>

<form on:submit|preventDefault={register}>
  <h2>สมัครสมาชิก</h2>

  {#if error}
    <p style="color: red;">{error}</p>
  {/if}

  <input placeholder="Username" bind:value={username} required />
  <input type="email" placeholder="Email" bind:value={email} required />
  <input type="password" placeholder="Password" bind:value={password} required />

  <button type="submit">สมัคร</button>
</form>
