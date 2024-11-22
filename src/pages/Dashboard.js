import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import logo from "../assets/logo.png";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Dashboard() {
    const [tickets, setTickets] = useState([]);

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

    return (
        <div className={styles.container}>
            <header className={styles.navbar}>
                <img src={logo} alt="Logo" className={styles.logo} />
                <nav>
                    <ul className={styles.navLinks}>
                        <li><a href="#">Logout</a></li>
                    </ul>
                </nav>
            </header>
            <div className={styles.dashboardBody}>
                <aside className={styles.sidebar}>
                    {/* <ul>
                        <li><a href="#">Tickets</a></li>
                    </ul> */}
                </aside>
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
                                    <td>{ticket.location}</td>
                                    <td>{formatDateTime(ticket.incidentTime)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>
            </div>
        </div>
    );
}
