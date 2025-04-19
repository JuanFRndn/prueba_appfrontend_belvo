export async function registerUser(username, password) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/users/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }
  );

  if (!response.ok) throw new Error(await response.text());
  return await response.json();
}

export async function loginUser(username, password) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) throw new Error(await response.text());
  return await response.json();
}
