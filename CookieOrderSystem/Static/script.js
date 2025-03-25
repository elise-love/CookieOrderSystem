// 變數儲存用戶選取訂單內容
let orderItems = [];

// 為每一個 cookie item 加上 dragstart 事件
document.querySelectorAll('.cookie-item').forEach(item => {
//找出頁面中所有具有 cookie-item 類別的 DOM 元素（餅乾商品），逐一處理。

    item.addEventListener('dragstart', (e) => {
    // 當使用者開始拖曳某個餅乾商品時，綁定 dragstart 事件

        e.dataTransfer.setData('text/plain', item.getAttribute('data-id'));
        //把該商品的 data - id 存入 dataTransfer，以便拖放結束時可以辨識是哪個商品被拖曳。
    });
});

// drop-box
const dropBox = document.getElementById('drop-box');
//找到網頁中 ID 為 drop-box 的元素，用來放置拖曳進來的商品。

dropBox.addEventListener('dragover', (e) => {
    e.preventDefault();
});
//為了讓 dropBox 能夠接收拖放，必須在 dragover 事件中呼叫 e.preventDefault()，否則預設情況下不能放東西。

dropBox.addEventListener('drop', (e) => {
    e.preventDefault();
    // 當物品被放到 drop-box 上時，觸發這個事件，並阻止預設行為


    const cookieId = e.dataTransfer.getData('text/plain');
    // 從拖曳資料中取出我們之前用 setData 存的商品 ID。

    const cookieItem = document.querySelector(`.cookie-item[data-id="${cookieId}"]`);
    //根據 cookieId 找到原本被拖曳的那個餅乾項目的 DOM 元素。


    // 取得數量與價格
    const quantityInput = cookieItem.querySelector('.quantity');
    //找出商品中的數量輸入欄位（class 為 quantity 的 input）

    const quantity = parseInt(quantityInput.value);
    // 讀取數量欄位的值，轉換為整數

    const price = parseFloat(cookieItem.getAttribute('data-price'));

    // 更新或新增 orderItems
    let exist = orderItems.find(item => item.id === cookieId);
    //檢查這筆商品是否已經存在於訂單中。

    if (exist) {
        exist.quantity += quantity;
        exist.total += price * quantity;
        //如果已存在，就累加數量與總價。
    } else {
        orderItems.push({
            id: cookieId,
            quantity: quantity,
      1s      total: price * quantity
        });
        // 如果不存在，就建立新的一筆訂單資料，包含商品 ID、數量與小計
    }

    updateDropBox();
    //新畫面上 dropBox 裡顯示的訂單資訊。
});

// 更新 dropBox 顯示的訂單內容（示範函式）
function updateDropBox() {
    dropBox.innerHTML = '<h4>已選擇項目：</h4>';
    // 先清空 dropBox 的內容，並加上標題文字

    orderItems.forEach(item => {
        dropBox.innerHTML += `<p>ID: ${item.id}，數量: ${item.quantity}，總價: $${item.total.toFixed(2)}</p>`;
    //把 orderItems 裡的每個項目依序列出，顯示商品 ID、數量與總價（保留小數點後兩位）。
    });
}

    document.getElementById('confirm-order').addEventListener('click', () => {
    if (orderItems.length === 0) {
        alert("請先選擇至少一項餅乾！");
        return;
    }
    // 這裡使用 fetch API 傳送資料
    fetch('/confirm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ order: orderItems })
    })
        .then(response => response.json())
        .then(data => {
            alert("訂單送出，訂單編號：" + data.order_id);
            // 清空訂單內容
            orderItems = [];
            updateDropBox();
        })
        .catch(err => {
            console.error(err);
            alert("訂單送出失敗！");
        });
});