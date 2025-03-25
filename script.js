const rows = 8;
const cols = 8;
const bombs = 10;
let board = [];
let revealedCount = 0;

const gameBoard = document.getElementById("game-board");
const statusText = document.getElementById("status");

function initGame() {
    board = Array(rows).fill().map(() => Array(cols).fill({ isBomb: false, revealed: false, count: 0 }));
    revealedCount = 0;
    statusText.textContent = ""; 

    // วางระเบิดแบบสุ่ม
    let placedBombs = 0;
    while (placedBombs < bombs) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);
        if (!board[r][c].isBomb) {
            board[r][c] = { isBomb: true, revealed: false, count: 0 };
            placedBombs++;
        }
    }

    // คำนวณตัวเลขรอบระเบิด
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (!board[r][c].isBomb) {
                board[r][c].count = countAdjacentBombs(r, c);
            }
        }
    }

    // สร้าง UI
    gameBoard.innerHTML = "";
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener("click", () => revealCell(r, c));
            gameBoard.appendChild(cell);
        }
    }
}

function countAdjacentBombs(r, c) {
    let count = 0;
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];
    directions.forEach(([dr, dc]) => {
        let nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].isBomb) {
            count++;
        }
    });
    return count;
}

function revealCell(r, c) {
    let cell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
    if (!cell || board[r][c].revealed) return;

    board[r][c].revealed = true;
    revealedCount++;

    if (board[r][c].isBomb) {
        cell.classList.add("bomb");
        cell.textContent = "💣";
        gameOver(false);
    } else {
        cell.classList.add("revealed");
        cell.textContent = board[r][c].count > 0 ? board[r][c].count : "";

        if (board[r][c].count === 0) {
            const directions = [
                [-1, -1], [-1, 0], [-1, 1],
                [0, -1],           [0, 1],
                [1, -1], [1, 0], [1, 1]
            ];
            directions.forEach(([dr, dc]) => revealCell(r + dr, c + dc));
        }
    }

    if (revealedCount === rows * cols - bombs) {
        gameOver(true);
    }
}

function gameOver(win) {
    statusText.textContent = win ? "🎉 คุณชนะ!" : "💥 เกมโอเวอร์!";
    document.querySelectorAll(".cell").forEach(cell => cell.style.pointerEvents = "none");
}

function resetGame() {
    revealedCount = 0;
    statusText.textContent = "";  
    document.querySelectorAll(".cell").forEach(cell => cell.style.pointerEvents = "auto");
    initGame();
}

// เริ่มเกม
initGame();
