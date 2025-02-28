import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Attendance.css'; // Import the CSS file

const Attendance = () => {
    const [attendanceData, setAttendanceData] = useState({});
    const [summary, setSummary] = useState({ present: 0, absent: 0, holidays: 0, attendancePercent: 0 });
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        // Replace with your API endpoint
        axios.get(`https://api.example.com/attendance?year=${year}`)
            .then(response => {
                const data = response.data;
                setAttendanceData(data);
                calculateSummary(data);
            })
            .catch(error => {
                console.error('Error fetching attendance data:', error);
            });
    }, [year]);

    const calculateSummary = (data) => {
        let present = 0;
        let absent = 0;
        let holidays = 0;
        let totalDays = 0;

        Object.keys(data).forEach(month => {
            data[month].forEach(day => {
                if (day === 'P') present++;
                else if (day === 'A') absent++;
                else holidays++;
                totalDays++;
            });
        });

        const attendancePercent = ((present / totalDays) * 100).toFixed(2);
        setSummary({ present, absent, holidays, attendancePercent });
    };

    const getRandomAttendance = () => {
        const values = ['P', 'A', ''];
        return values[Math.floor(Math.random() * values.length)];
    };

    return (
        <div className="container">
            <div className="header">
                <h1>Attendance Record</h1>
            </div>
            <div className="year-dropdown">
                <label htmlFor="year">Select Year: </label>
                <select id="year" value={year} onChange={(e) => setYear(e.target.value)}>
                    {[2023, 2024, 2025].map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </div>
            <div className="summary-container">
                <div className="summary-card present">
                    <h2>Total Days Present</h2>
                    <p>{summary.present}</p>
                </div>
                <div className="summary-card absent">
                    <h2>Total Days Absent</h2>
                    <p>{summary.absent}</p>
                </div>
                <div className="summary-card holidays">
                    <h2>Total Holidays</h2>
                    <p>{summary.holidays}</p>
                </div>
                <div className="summary-card percent">
                    <h2>Attendance Percent</h2>
                    <p>{summary.attendancePercent}%</p>
                </div>
            </div>
            <table className="attendance-table">
                <thead>
                    <tr>
                        <th className="header-cell">Month</th>
                        {[...Array(31)].map((_, i) => (
                            <th key={i + 1} className="header-cell">{i + 1}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(month => (
                        <tr key={month}>
                            <td className="month-cell">{month}</td>
                            {[...Array(31)].map((_, i) => (
                                <td key={i + 1} className="data-cell">
                                    {attendanceData[month] && attendanceData[month][i + 1] ? attendanceData[month][i + 1] : getRandomAttendance()}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Attendance;
