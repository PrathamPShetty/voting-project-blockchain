import React from "react";
import "./guide.css";

const Guidelines = () => {
  return (
    <div class="main-content">
        <div class="header">
            Voting System Guidelines
        </div>

     
        <div class="content">
            <h2>Project Guidelines for Online Voting System</h2>
            <p>Welcome to the Online Voting System. Please follow the guidelines below to ensure smooth and secure participation in the voting process.</p>
            
            <h3>User Guidelines</h3>
            <ul>
                <li>Only authorized users with valid credentials can participate in the voting process.</li>
                <li>Make sure to protect your login details and credentials. Do not share your password with anyone.</li>
                <li>If you forget your login credentials, please use the "Forgot Password" option to reset your account information securely.</li>
                <li>Ensure you are voting only once per election. Duplicate voting is prevented by the blockchain system.</li>
                <li>Review your selections before submitting your vote. Once submitted, your vote cannot be changed.</li>
                <li>For any issues with voting or account access, please contact the support team.</li>
            </ul>

            <h3>Voting Process</h3>
            <ul>
                <li>Upon logging in, you will be able to view the active election(s) available for voting.</li>
                <li>Click on the election of your choice to view the candidates or options available for voting.</li>
                <li>Select your preferred option and click the "Vote" button to cast your vote securely.</li>
                <li>Once your vote is submitted, it is recorded on the blockchain and cannot be altered.</li>
                <li>Ensure you have completed the authentication process to confirm your identity before voting.</li>
                <li>All votes are anonymous and securely encrypted using blockchain technology to maintain privacy.</li>
            </ul>

            <h3>Security Guidelines</h3>
            <ul>
                <li>All user data, including login credentials and personal information, are stored securely using encrypted databases.</li>
                <li>For authentication, ensure you are using a secure password (minimum 8 characters, including numbers, letters, and special characters).</li>
                <li>Blockchain technology ensures the integrity of the voting process. Once a vote is cast, it is securely recorded on the blockchain and cannot be altered or tampered with.</li>
                <li>All communication between users and the voting system is encrypted using HTTPS (SSL/TLS) to protect against interception and eavesdropping.</li>
                <li>Do not share your login credentials, and always log out from the system after voting, especially if using a shared computer.</li>
                <li>In case of suspicious activity or unauthorized access, contact the support team immediately.</li>
            </ul>

            <h3>Admin Guidelines</h3>
            <ul>
                <li>Admins are responsible for monitoring the voting process and ensuring it is conducted fairly.</li>
                <li>Admins should have access to audit trails for each election to verify the integrity of votes cast.</li>
                <li>Admins must ensure that the blockchain network remains secure and that all data is stored and processed correctly.</li>
                <li>Any issues or breaches in security should be investigated immediately to prevent damage to the integrity of the voting system.</li>
            </ul>

            <h3>Legal and Compliance Guidelines</h3>
            <ul>
                <li>The voting system complies with local and international regulations regarding electronic voting, privacy, and data protection.</li>
                <li>Ensure that all users are made aware of their rights and responsibilities before participating in the voting process.</li>
                <li>Only eligible voters, as verified by the authentication system, are allowed to cast votes in an election.</li>
                <li>All votes are encrypted and stored securely, ensuring anonymity and integrity throughout the process.</li>
            </ul>
        </div>
    </div>
  );
};

export default Guidelines;
