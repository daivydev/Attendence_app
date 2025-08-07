const buoiHocData = [
  {
    maBuoiHoc: 1,
    tenBuoiHoc: "Buổi học 1",
    ketQua: "Xem chi tiết",
    tietHoc: 3,
    ngayHoc: "2025-08-07",
  },
  {
    maBuoiHoc: 2,
    tenBuoiHoc: "Buổi học 2",
    ketQua: "Xem chi tiết",
    tietHoc: 4,
    ngayHoc: "2025-08-08",
  },
  {
    maBuoiHoc: 3,
    tenBuoiHoc: "Buổi học 3",
    ketQua: "Xem chi tiết",
    tietHoc: 2,
    ngayHoc: "2025-08-09",
  },
  {
    maBuoiHoc: 4,
    tenBuoiHoc: "Buổi học 4",
    ketQua: "Xem chi tiết",
    tietHoc: 2,
    ngayHoc: "2025-08-09",
  },
];

function renderTable(data) {
  const tbody = document.querySelector("table.fl-table tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  data.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.tenBuoiHoc}</td>
      <td><a href="#">${item.ketQua}</a></td>
      <td>
        <button class="btn btn-outline-secondary btn-sm btn-edit" data-id="${
          item.maBuoiHoc
        }" data-bs-toggle="modal" data-bs-target="#popupSua">
          Sửa
        </button>
      </td>
      <td>
        <button class="btn btn-outline-danger btn-sm btn-delete" data-id="${
          item.maBuoiHoc
        }" data-bs-toggle="modal" data-bs-target="#popupXoa">
          Xoá
        </button>
      </td>
      <td><a href="/html/layout/main.html?page=attendence">Điểm danh</a></td>
    `;
    tbody.appendChild(tr);
  });
}

// --- Xử lý xoá ---
function setupDeleteModal() {
  const popupXoa = document.getElementById("popupXoa");
  if (!popupXoa) return;

  const btnXacNhanXoa = popupXoa.querySelector("#btnXacNhanXoa");
  let currentIdToDelete = null;

  popupXoa.addEventListener("show.bs.modal", (event) => {
    const button = event.relatedTarget;
    const id = button.getAttribute("data-id");
    currentIdToDelete = Number(id);

    const modalBody = popupXoa.querySelector(".modal-body");
    const item = buoiHocData.find((b) => b.maBuoiHoc === currentIdToDelete);
    modalBody.textContent = `Bạn có chắc chắn muốn xoá "${item?.tenBuoiHoc}" không?`;
  });

  btnXacNhanXoa.addEventListener("click", () => {
    if (currentIdToDelete !== null) {
      const index = buoiHocData.findIndex((item) => item.maBuoiHoc === currentIdToDelete);
      if (index !== -1) {
        buoiHocData.splice(index, 1);
        renderTable(buoiHocData);
      }

      const modalInstance = bootstrap.Modal.getInstance(popupXoa);
      modalInstance?.hide();
    }
  });
}

function setupEditModal() {
  const popupSua = document.getElementById("popupSua");
  if (!popupSua) return;

  const inputTen = popupSua.querySelector("#suaTenBuoiHoc");
  const inputNgay = popupSua.querySelector("#suaNgayHoc");
  const btnLuuSua = popupSua.querySelector("#btnLuuSua");

  let currentIdToEdit = null;

  popupSua.addEventListener("show.bs.modal", (event) => {
    const button = event.relatedTarget;
    const id = Number(button.getAttribute("data-id"));
    currentIdToEdit = id;

    const item = buoiHocData.find((b) => b.maBuoiHoc === id);
    if (item) {
      inputTen.value = item.tenBuoiHoc;
      inputNgay.value = item.ngayHoc;
    }
  });

  btnLuuSua.addEventListener("click", () => {
    const ten = inputTen.value.trim();
    const ngay = inputNgay.value;

    if (!ten || !ngay) {
      Swal.fire("Lỗi", "Vui lòng nhập đầy đủ tên buổi học và ngày học", "warning");
      return;
    }

    if (currentIdToEdit !== null) {
      const index = buoiHocData.findIndex((b) => b.maBuoiHoc === currentIdToEdit);
      if (index !== -1) {
        buoiHocData[index].tenBuoiHoc = ten;
        buoiHocData[index].ngayHoc = ngay;
        renderTable(buoiHocData);
      }

      const modalInstance = bootstrap.Modal.getInstance(popupSua);
      modalInstance?.hide();
    }
  });
}

function setupAddModal() {
  const popupThem = document.getElementById("popupThem");
  if (!popupThem) return;

  const inputTen = popupThem.querySelector("#themTenBuoiHoc");
  const inputNgay = popupThem.querySelector("#themNgayHoc");
  const btnLuu = popupThem.querySelector(".btn-next-primary");

  btnLuu.addEventListener("click", () => {
    const ten = inputTen.value.trim();
    const ngay = inputNgay.value;
    console.log(ngay);

    if (!ten || !ngay) {
      Swal.fire("Lỗi", "Vui lòng nhập đầy đủ tên buổi học và ngày học", "warning");
      return;
    }

    const newBuoiHoc = {
      maBuoiHoc: Date.now(), // Tạo ID tạm thời
      tenBuoiHoc: ten,
      ketQua: "Xem chi tiết",
      tietHoc: Math.floor(Math.random() * 4) + 1,
      ngayHoc: ngay,
    };

    buoiHocData.push(newBuoiHoc);
    renderTable(buoiHocData);

    const modalInstance = bootstrap.Modal.getInstance(popupThem);
    modalInstance?.hide();

    // Reset form
    inputTen.value = "";
    inputNgay.value = "";
  });
}

window.initClassesPage = function () {
  renderTable(buoiHocData);
  setupEditModal();
  setupDeleteModal();
  setupAddModal();
};
