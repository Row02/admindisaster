import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import logo from "../assets/logo.png";
import { db, auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [tickets, setTickets] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
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
            navigate("/");
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    };

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    const updateStatus = async (ticketId, newStatus) => {
        try {
            const ticketDoc = doc(db, "tickets", ticketId);
            await updateDoc(ticketDoc, { status: newStatus });
            setTickets((prevTickets) =>
                prevTickets.map((ticket) =>
                    ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
                )
            );
        } catch (error) {
            console.error("Error updating status: ", error);
        }
    };

    const groupByDisasterType = (tickets) => {
        return tickets.reduce((groups, ticket) => {
            const { disasterType } = ticket;
            if (!groups[disasterType]) {
                groups[disasterType] = [];
            }
            groups[disasterType].push(ticket);
            return groups;
        }, {});
    };

    const disasterGroups = groupByDisasterType(tickets);

    const deleteTicketsByStatus = async (statusToDelete) => {
        try {
            // Filter tickets by the given status
            const ticketsToDelete = tickets.filter((ticket) => ticket.status === statusToDelete);

            // Delete each ticket in Firestore
            await Promise.all(
                ticketsToDelete.map(async (ticket) => {
                    const ticketDoc = doc(db, "tickets", ticket.id);
                    await deleteDoc(ticketDoc);
                })
            );

            // Update the state to remove deleted tickets
            setTickets((prevTickets) =>
                prevTickets.filter((ticket) => ticket.status !== statusToDelete)
            );

            console.log(`Deleted all tickets with status: ${statusToDelete}`);
        } catch (error) {
            console.error(`Error deleting tickets with status ${statusToDelete}:`, error);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.navbar}>
                <img src={logo} alt="Logo" className={styles.logo} />
                <nav>
                    <ul className={styles.navLinks}>
                        <li>
                            <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
                        </li>
                    </ul>
                </nav>
            </header>
            <div className={styles.dashboardBody}>
                <main className={styles.mainContent}>
                    <div className={styles.tableHeader}>
                        <span>Reports</span>
                        <div className={styles.tableFunctions}>
                            <button
                                className={styles.btnNotComplete}
                                onClick={() => deleteTicketsByStatus("notComplete")}
                            >
                                Delete All Not Complete
                            </button>
                            <button
                                className={styles.btnSuccessful}
                                onClick={() => deleteTicketsByStatus("complete")}
                            >
                                Clear All Successful
                            </button>
                        </div>
                    </div>
                    {Object.keys(disasterGroups).map((disasterType) => (
                        <div key={disasterType} className={styles.disasterSection}>
                            <h3>{disasterType}</h3>
                            <table className={styles.ticketsTable}>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Message</th>
                                        <th>Picture</th>
                                        <th>Location</th>
                                        <th>Incident Time</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {disasterGroups[disasterType].map((ticket) => (
                                        <tr
                                            key={ticket.id}
                                            style={{
                                                backgroundColor:
                                                    ticket.status === "notComplete"
                                                        ? "lightcoral"
                                                        : ticket.status === "complete"
                                                        ? "lightgreen"
                                                        : "lightyellow",
                                            }}
                                        >
                                            <td>{ticket.name}</td>
                                            <td>{ticket.email}</td>
                                            <td>{ticket.phone}</td>
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
                                            <td>
                                                <div className={styles.statusGroup}>
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            name={`status-${ticket.id}`}
                                                            value="onGoing"
                                                            checked={!ticket.status || ticket.status === "onGoing"}
                                                            onChange={() => updateStatus(ticket.id, "onGoing")}
                                                        />
                                                        On Going
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            name={`status-${ticket.id}`}
                                                            value="notComplete"
                                                            checked={ticket.status === "notComplete"}
                                                            onChange={() => updateStatus(ticket.id, "notComplete")}
                                                        />
                                                        Not Complete
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            name={`status-${ticket.id}`}
                                                            value="complete"
                                                            checked={ticket.status === "complete"}
                                                            onChange={() => updateStatus(ticket.id, "complete")}
                                                        />
                                                        Finished Successful
                                                    </label>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </main>
            </div>

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
