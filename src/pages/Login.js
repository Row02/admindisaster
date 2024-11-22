import React, { useState } from "react";
import styles from "./Login.module.css";
import logo from "../assets/logo.png";
import { auth } from "../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Clear any previous errors

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in: ", userCredential.user);

            navigate("/dashboard");
            alert("Login successful!");

        } catch (err) {
            console.error("Login error: ", err);
            setError("Invalid email or password. Please try again.");
        }
    };

    return (
        <div className={styles.container}>
            <img src={logo} alt="Logo" className={styles.logo} />
            <div className={styles.loginBox}>
                <h2 className={styles.title}>Admin Login</h2>
                {error && <p className={styles.errorMessage}>{error}</p>}
                <form className={styles.loginForm} onSubmit={handleLogin}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.loginButton}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
