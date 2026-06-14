import { useState } from "react";
import "./Login.css";

const DUMMY_USERS = [
    {
        role: "Student",
        class: "10",
        section: "A",
        rollNumber: "12",
        email: "student.10.a.12@school.com",
        password: "student123",
    },
    {
        role: "Student",
        class: "12",
        section: "C",
        rollNumber: "07",
        email: "student.12.c.07@school.com",
        password: "student123",
    },
    {
        role: "Teacher",
        class: "10",
        section: "A",
        subject: "React",
        email: "teacher.10.a@school.com",
        password: "teacher123",
    },
];

function Login() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const fillUser = (user) => {
        setForm({
            email: user.email,
            password: user.password,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const user = DUMMY_USERS.find(
            (u) =>
                u.email === form.email &&
                u.password === form.password
        );

        if (!user) {
            alert("Invalid email or password");
            return;
        }

        localStorage.setItem(
            "loggedInUser",
            JSON.stringify({
                role: user.role,
                class: user.class,
                section: user.section,
                rollNumber: user.rollNumber,
                subject: user.subject,
                email: user.email,
            })
        );

        // alert("Login successful");
    };

    return (
        <div className="login-page">
            <div className="login-card">

                <h1>Login</h1>

                <div className="demo-users">

                    <p className="demo-title">
                        Development Users
                    </p>

                    {DUMMY_USERS.map((user) => (
                        <button
                            key={user.email}
                            type="button"
                            className="demo-user"
                            onClick={() => fillUser(user)}
                        >
                            <div>
                                <strong>{user.role}</strong>
                            </div>

                            <div>
                                Class {user.class} • Section {user.section}
                            </div>

                            {user.rollNumber && (
                                <div>
                                    Roll No: {user.rollNumber}
                                </div>
                            )}

                            {user.subject && (
                                <div>
                                    Subject: {user.subject}
                                </div>
                            )}

                        </button>
                    ))}

                </div>

                <form onSubmit={handleSubmit}>

                    <input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                email: e.target.value,
                            })
                        }
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                password: e.target.value,
                            })
                        }
                    />

                    <button
                        className="login-submit"
                        type="submit"
                    >
                        Login
                    </button>

                </form>

            </div>
        </div>
    );
}

export default Login;