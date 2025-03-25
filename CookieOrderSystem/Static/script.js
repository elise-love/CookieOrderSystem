// �ܼ��x�s�Τ����q�椺�e
let orderItems = [];

// ���C�@�� cookie item �[�W dragstart �ƥ�
document.querySelectorAll('.cookie-item').forEach(item => {
//��X�������Ҧ��㦳 cookie-item ���O�� DOM �����]�氮�ӫ~�^�A�v�@�B�z�C

    item.addEventListener('dragstart', (e) => {
    // ��ϥΪ̶}�l�즲�Y�ӻ氮�ӫ~�ɡA�j�w dragstart �ƥ�

        e.dataTransfer.setData('text/plain', item.getAttribute('data-id'));
        //��Ӱӫ~�� data - id �s�J dataTransfer�A�H�K��񵲧��ɥi�H���ѬO���Ӱӫ~�Q�즲�C
    });
});

// drop-box
const dropBox = document.getElementById('drop-box');
//�������� ID �� drop-box �������A�Ψө�m�즲�i�Ӫ��ӫ~�C

dropBox.addEventListener('dragover', (e) => {
    e.preventDefault();
});
//���F�� dropBox ����������A�����b dragover �ƥ󤤩I�s e.preventDefault()�A�_�h�w�]���p�U�����F��C

dropBox.addEventListener('drop', (e) => {
    e.preventDefault();
    // ���~�Q��� drop-box �W�ɡAĲ�o�o�Өƥ�A�ê���w�]�欰


    const cookieId = e.dataTransfer.getData('text/plain');
    // �q�즲��Ƥ����X�ڭ̤��e�� setData �s���ӫ~ ID�C

    const cookieItem = document.querySelector(`.cookie-item[data-id="${cookieId}"]`);
    //�ھ� cookieId ���쥻�Q�즲�����ӻ氮���ت� DOM �����C


    // ���o�ƶq�P����
    const quantityInput = cookieItem.querySelector('.quantity');
    //��X�ӫ~�����ƶq��J���]class �� quantity �� input�^

    const quantity = parseInt(quantityInput.value);
    // Ū���ƶq��쪺�ȡA�ഫ�����

    const price = parseFloat(cookieItem.getAttribute('data-price'));

    // ��s�ηs�W orderItems
    let exist = orderItems.find(item => item.id === cookieId);
    //�ˬd�o���ӫ~�O�_�w�g�s�b��q�椤�C

    if (exist) {
        exist.quantity += quantity;
        exist.total += price * quantity;
        //�p�G�w�s�b�A�N�֥[�ƶq�P�`���C
    } else {
        orderItems.push({
            id: cookieId,
            quantity: quantity,
      1s      total: price * quantity
        });
        // �p�G���s�b�A�N�إ߷s���@���q���ơA�]�t�ӫ~ ID�B�ƶq�P�p�p
    }

    updateDropBox();
    //�s�e���W dropBox ����ܪ��q���T�C
});

// ��s dropBox ��ܪ��q�椺�e�]�ܽd�禡�^
function updateDropBox() {
    dropBox.innerHTML = '<h4>�w��ܶ��ءG</h4>';
    // ���M�� dropBox �����e�A�å[�W���D��r

    orderItems.forEach(item => {
        dropBox.innerHTML += `<p>ID: ${item.id}�A�ƶq: ${item.quantity}�A�`��: $${item.total.toFixed(2)}</p>`;
    //�� orderItems �̪��C�Ӷ��ب̧ǦC�X�A��ܰӫ~ ID�B�ƶq�P�`���]�O�d�p���I����^�C
    });
}

    document.getElementById('confirm-order').addEventListener('click', () => {
    if (orderItems.length === 0) {
        alert("�Х���ܦܤ֤@���氮�I");
        return;
    }
    // �o�̨ϥ� fetch API �ǰe���
    fetch('/confirm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ order: orderItems })
    })
        .then(response => response.json())
        .then(data => {
            alert("�q��e�X�A�q��s���G" + data.order_id);
            // �M�ŭq�椺�e
            orderItems = [];
            updateDropBox();
        })
        .catch(err => {
            console.error(err);
            alert("�q��e�X���ѡI");
        });
});