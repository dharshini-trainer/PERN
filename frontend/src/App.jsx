import { useEffect, useState } from "react";

function App() {
    const [students, setStudents] = useState([]);
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [course, setCourse] = useState("");

    const getStudents = () => {
        fetch("http://localhost:5000/students")
            .then(response => response.json())
            .then(data => setStudents(data));
    };

    useEffect(() => {
        getStudents();
    }, []);

    const addStudent = () => {
        fetch("http://localhost:5000/students", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                age: age,
                course: course
            })
        })
        .then(response => response.json())
        .then(() => {
            setName("");
            setAge("");
            setCourse("");
            getStudents();
        });
    };

    return (
        <div>
            <h1>Student Management</h1>

            <input
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
            />

            <input
                placeholder="Age"
                value={age}
                onChange={e => setAge(e.target.value)}
            />

            <input
                placeholder="Course"
                value={course}
                onChange={e => setCourse(e.target.value)}
            />

            <button onClick={addStudent}>Add Student</button>

            <h2>Students</h2>

            {students.map(student => (
                <div key={student.id}>
                    <h3>{student.name}</h3>
                    <p>Age: {student.age}</p>
                    <p>Course: {student.course}</p>
                </div>
            ))}
        </div>
    );
}

export default App;