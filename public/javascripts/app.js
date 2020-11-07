const API = 'http://localhost:3000/api/v1/sanphams';
const blockListSanPham = document.getElementById('list_sanpham');
var checkboxAll = $('#checkbox-all');
var btnDelete = $('#btnDelete');
start();

function start() {
    getSanphams(renderSanphams);

}

function handleCheckAll() {
    var isCheckedAll = checkboxAll.prop('checked');
    var sanPhamItemCheckbox = $('input[name="masanphams[]"]');
    sanPhamItemCheckbox.prop('checked', isCheckedAll);
    if ($('input[name="masanphams[]"]:checked').length > 0)
        btnDelete.removeAttr("disabled");
    else {
        btnDelete.attr("disabled", "true");
    }
}

function handleCheckItem() {
    var sanPhamItemCheckbox = $('input[name="masanphams[]"]');
    var isCheckedAll = sanPhamItemCheckbox.length === $('input[name="masanphams[]"]:checked').length;
    checkboxAll.prop('checked', isCheckedAll);
    if ($('input[name="masanphams[]"]:checked').length > 0)
        btnDelete.removeAttr("disabled");
    else {
        btnDelete.attr("disabled", "true");
    }
}

function getSanphams(callback) {
    fetch(API).then(res => {
        return res.json();
    }).then(callback);
}

function renderSanphams(sanphams) {
    sanphams.data.sort((a, b) => parseInt(a.ma) - parseInt(b.ma));
    var htmls = sanphams.data.map(sp => {
        return `
        <tr id="item-${sp.ma}">
            <td><input onchange="handleCheckItem()" type="checkbox" name="masanphams[]" id="masanphams" value="${sp.ma}"></td>
            <td scope="row">${sp.ma}</td>
            <td>${sp.ten}</td>
            <td>${sp.soluong}</td>
        </tr>
        `;
    });
    if (htmls.length == 0)
        htmls = ["<tr><td colspan='4'>Không có dữ liệu</td></tr>"];
    blockListSanPham.innerHTML = htmls.join('');
    $('#loading').css("display", "none");
}

function handleAdd() {
    $('#loading').css("display", "block");
    const form = document.getElementById('formAdd');
    fetch(API, {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },

        //make sure to serialize your JSON body
        body: JSON.stringify({
            ma: form.ma.value,
            ten: form.ten.value,
            soluong: form.soluong.value
        })
    }).then(res => {
        return res.json();
    }).then(data => {
        if (data.status == false) {
            document.getElementsByName('error').forEach(e => {
                e.innerHTML = '';
            })
            data.errors.forEach(element => {
                document.getElementById('error-' + element.param).innerHTML = element.msg;
            });
        } else {
            form.reset();
            showAlertSuccess(data.message);
            $('#modelThem').modal('toggle');
            getSanphams(renderSanphams);
        }
        $('#loading').css("display", "none");
    });
}

function showConfirmDelete() {
    var checkboxes = document.querySelectorAll('input[name="masanphams[]"]:checked')
    if (checkboxes.length !== 0) {
        $('#modelId').modal('toggle');
    }
}

function handleDelete() {
    $('#modelId').modal('toggle');
    $('#loading').css("display", "block");
    var checkboxes = document.querySelectorAll('input[name="masanphams[]"]:checked')
    if (checkboxes.length !== 0) {
        var array = []

        for (var i = 0; i < checkboxes.length; i++) {
            array.push(checkboxes[i].value)
        }
        fetch(API + "/delete", {
            method: "POST",
            headers: {
                "Accept-Type": "application/json;",
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({ masanphams: array })
        }).then((res) => {
            return res.json();
        }).then(data => {
            if (data.status === true) {
                for (var i = 0; i < checkboxes.length; i++) {
                    document.getElementById('item-' + checkboxes[i].value).remove();
                }
                btnDelete.attr("disabled", "true");
                showAlertSuccess(data.message);
            } else {
                showAlertDanger(data.message);
            }
            $('#loading').css("display", "none");
        });
    }
}

function showAlertSuccess(message) {
    document.getElementById('alert').innerHTML = `
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
        </button>
        <strong>${message}</strong>
    </div>
    `;
}

function showAlertDanger(message) {
    document.getElementById('alert').innerHTML = `
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
        </button>
        <strong>${message}</strong>
    </div>
    `;
}