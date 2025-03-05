fetch("http://localhost:5000/api/auth/me")
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
