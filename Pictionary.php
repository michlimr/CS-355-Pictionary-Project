<?php
// Start the session (if needed for your application)
session_start();

// Database credentials
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "PicDB";

// Create a new MySQLi connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check if the connection was successful
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle the theme insertion via POST (AJAX)
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['theme'])) {
    $theme = $_POST['theme'];

    // Prepare the SQL query to insert the new theme into the database
    $stmt = $conn->prepare("INSERT INTO PictionaryThemes (Theme) VALUES (?)");
    $stmt->bind_param("s", $theme);  // "s" means the theme is a string

    // Execute the query and check if it was successful
    if ($stmt->execute()) {
        echo "Theme '" . htmlspecialchars($theme) . "' added to the database!";
    } else {
        echo "Error adding theme: " . $conn->error;
    }

    // Close the prepared statement
    $stmt->close();
    exit();  // Exit to prevent the HTML from being sent again
}

// Close the database connection
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            margin: 0;
            padding: 0;
        }
        html, body {
            height: auto;
        }
        #container {
            background-size: 100% 100%;
            background-color: #2F4858;
            height: 100vh;
        }
        #header {
            background-color: #2F4858;
            color: black;
            padding: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .navbar {
            padding: 10px;
            display: flex;
            list-style-type: none;
            font-weight: bold;
            background-color: #2F4858;
        }
        .navbar li {
            margin-right: 30px;
        }
        .navbar li a {
            text-decoration: none;
            color: black;
        }
        .navbar li a:hover {
            text-decoration: underline;
            color: rgb(22, 146, 223);
        }
        .button {
            background-color: #86BBD8;
            color: white;
            font-weight: bold;
            border: none;
            padding: 5px 20px;
            cursor: pointer;
            margin-right: 10px;
            border: 3px solid #857e61;
        }
        .button:hover {
            background-color: #33658A;
        }
        .containertwo {
            width: 100%;
            height: 40%;
            display: flex;
            box-sizing: border-box;
        }
        .playerlist {
            padding: 10px;
            margin: 10px;
            height: 50vh;
            width: 12.5%;
            justify-content: space-between;
            background: linear-gradient(to bottom, #33658A 0%, #33658A 10%, #86BBD8 10%, #86BBD8 100%);
            font-weight: bold;
            border: 3px solid #857e61;
        }
        .canvas {
            background-color: white;
            margin: 10px;
            width: 65%;
            height: 70vh;
            border: 3px solid #857e61;
        }
        .chatbox {
            height: 80vh;
            width: 20%;
            background-color: #33658A;
            padding: 10px;
            margin: 10px;
            border: 3px solid #857e61;
        }
        .creategame {
            height: 1px;
            width: 3px;
            padding-left: 50%;
            padding-top: 80%;
            background-color: white;
        }
        @media screen and (max-width: 1000px) {
            .containertwo {
                padding: 0px 20px;
            }
        }
    </style>
    <title>Pictionary Project</title>
</head>
<body>
    <div id="container">
        <div id="header">
            <ul class="navbar">
                <button class="button"> Create/End Game </button>
                <button class="button" id="addThemeButton"> Add Theme </button>
            </ul>

            <span style="padding-right: 9%; color: white; font-size: xx-large">0:00</span>
        </div>

        <div class="containertwo">
            <div class="playerlist">
                <h3 style="color: white; margin-top: 0; text-align: left;">Players:</h3>
            </div>

            <div class="canvas">
            </div>

            <div class="chatbox">
            </div>
        </div>
    </div>

    <script>
        // Get the add theme button by ID
        const addThemeButton = document.getElementById("addThemeButton");

        // Add a click event listener to the button
        addThemeButton.addEventListener("click", function() {
            // Prompt the user for a theme
            let theme = prompt("Type a theme you would like to add");

            // If the user entered a theme
            if (theme && theme.trim() !== "") {
                // Use Fetch API to send the theme to the server
                fetch("<?php echo $_SERVER['PHP_SELF']; ?>", {  // Use the current PHP file
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: `theme=${encodeURIComponent(theme)}`  // Send the theme as form data
                })
                .then(response => response.text())  // Get the response text
                .then(data => {
                    alert(data);  // Show an alert with the server's response
                })
                .catch(error => {
                    console.error("Error:", error);
                });
            } else {
                alert("No theme entered");
            }
        });
    </script>
</body>
</html>