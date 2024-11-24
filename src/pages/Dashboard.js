import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import logo from "../assets/logo.png";
import { db, auth } from "../firebase/firebase"; // Import auth
import { signOut } from "firebase/auth"; // Import signOut
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function Dashboard() {
    const [tickets, setTickets] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null); // To store the image to be displayed in the modal
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const ticketsCollection = collection(db, "tickets");
                const snapshot = await getDocs(ticketsCollection);
                const ticketsData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setTickets(ticketsData);
            } catch (error) {
                console.error("Error fetching tickets: ", error);
            }
        };

        fetchTickets();
    }, []);

    const formatDateTime = (dateTime) => {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
        return new Date(dateTime).toLocaleString("en-US", options);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/"); // Redirect to login page
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    };

    const handleImageClick = (image) => {
        setSelectedImage(image); // Set the image to display in the modal
    };

    const closeModal = () => {
        setSelectedImage(null); // Close the modal
    };

    return (
        <div className={styles.container}>
            <header className={styles.navbar}>
                <img src={logo} alt="Logo" className={styles.logo} />
                <nav>
                    <ul className={styles.navLinks}>
                        <li><button onClick={handleLogout} className={styles.logoutButton}>Logout</button></li>
                    </ul>
                </nav>
            </header>
            <div className={styles.dashboardBody}>
                <main className={styles.mainContent}>
                    <h2>Reports</h2>
                    <table className={styles.ticketsTable}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Disaster Type</th>
                                <th>Message</th>
                                <th>Picture</th>
                                <th>Location</th>
                                <th>Incident Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket) => (
                                <tr key={ticket.id}>
                                    <td>{ticket.name}</td>
                                    <td>{ticket.email}</td>
                                    <td>{ticket.phone}</td>
                                    <td>{ticket.disasterType}</td>
                                    <td>{ticket.message}</td>
                                    <td>
                                        {ticket.picture ? (
                                            <img
                                                src={ticket.picture}
                                                alt="Reported Incident"
                                                className={styles.reportedImage}
                                                onClick={() => handleImageClick(ticket.picture)}
                                            />
                                        ) : (
                                            "No Image"
                                        )}
                                    </td>
                                    <td>{ticket.location}</td>
                                    <td>{formatDateTime(ticket.incidentTime)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>
            </div>

            {/* Modal for image */}
            {selectedImage && (
                <div className={styles.modal} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <img src={selectedImage} alt="Large view" className={styles.largeImage} />
                        <button className={styles.closeButton} onClick={closeModal}>X</button>
                    </div>
                </div>
            )}
        </div>
    );
}
