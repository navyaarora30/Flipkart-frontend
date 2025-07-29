import { useState } from "react";
import { Box, TextField, Button, MenuItem } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobile: "",
    gender: "Male",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    setError("");

    try {
      const res = await fetch(
        "https://flipkart-backend-74av.onrender.com/api/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (res.ok && data.token) {
        // Save to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("firstName", form.firstName);
        localStorage.setItem("lastName", form.lastName);
        localStorage.setItem("email", form.email);
        localStorage.setItem("mobile", form.mobile);
        localStorage.setItem("gender", form.gender);

        navigate("/");
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <Box maxWidth={400} mx="auto" p={2}>
      <TextField
        label="First Name"
        name="firstName"
        value={form.firstName}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Last Name"
        name="lastName"
        value={form.lastName}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        name="email"
        value={form.email}
        onChange={handleChange}
        type="email"
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        name="password"
        value={form.password}
        onChange={handleChange}
        type="password"
        fullWidth
        margin="normal"
      />
      <TextField
        label="Mobile"
        name="mobile"
        value={form.mobile}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Gender"
        name="gender"
        value={form.gender}
        onChange={handleChange}
        select
        fullWidth
        margin="normal"
      >
        <MenuItem value="Male">Male</MenuItem>
        <MenuItem value="Female">Female</MenuItem>
      </TextField>

      {error && (
        <Box color="red" my={1}>
          {error}
        </Box>
      )}

      <Button
        onClick={handleSignup}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        Sign Up
      </Button>

      <Box mt={2} textAlign="center">
        Already have an account? <Link to="/login">Login</Link>
      </Box>
    </Box>
  );
}

export default Signup;
