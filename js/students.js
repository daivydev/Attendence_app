// ================== MOCK DATA ==================
const students = [
  {
    id: 1,
    lastName: "Nguyễn Thanh",
    firstName: "An",
    dob: "21-05-2004",
    phone: "0901234567",
    email: "an@example.com",
    classes: [
      { id: 101, name: "Tư tưởng Hồ Chí Minh" },
      { id: 103, name: "Quản lý hành chính nhà nước" },
    ],
  },
  {
    id: 2,
    lastName: "Trần An",
    firstName: "Bình",
    dob: "10-11-2003",
    phone: "0987654321",
    email: "binh@example.com",
    classes: [
      { id: 102, name: "Đường lối, chính sách của Đảng và Nhà nước Việt Nam" },
    ],
  },
  {
    id: 3,
    lastName: "Lê Khánh",
    firstName: "Chi",
    dob: "02-03-2005",
    phone: "0912345678",
    email: "chi@example.com",
    classes: [],
  },
  {
    id: 4,
    lastName: "Phạm Tuấn",
    firstName: "Duy",
    dob: "29-12-2002",
    phone: "0978888888",
    email: "duy@example.com",
    classes: [{ id: 101, name: "Tư tưởng Hồ Chí Minh" }],
  },
  {
    id: 5,
    lastName: "Đỗ Thị",
    firstName: "Linh",
    dob: "08-08-2004",
    phone: "8491230000",
    email: "linh@example.com",
    classes: [
      { id: 102, name: "Đường lối, chính sách của Đảng và Nhà nước Việt Nam" },
      { id: 103, name: "Quản lý hành chính nhà nước" },
    ],
  },
];

const tbody = document.querySelector(".studentsTableBody");
const sortSel = document.getElementById("sortBy");
const searchBtn = document.getElementById("btnSearch");
const kwInput = document.getElementById("kw");

function fullName(st) {
  return `${st.lastName} ${st.firstName}`.trim();
}

// Bỏ dấu + lowercase để so sánh công bằng
function normalize(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

// Parse dob an toàn: hỗ trợ dd-mm-yyyy (mặc định của bạn), yyyy-mm-dd, dd/mm/yyyy
function parseDob(d) {
  if (!d) return null;
  if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(d)) {
    const [dd, mm, yyyy] = d.split("-").map(Number);
    return new Date(yyyy, mm - 1, dd);
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
    return new Date(d + "T00:00:00");
  }
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(d)) {
    const [dd, mm, yyyy] = d.split("/").map(Number);
    return new Date(yyyy, mm - 1, dd);
  }
  const dt = new Date(d);
  return isNaN(dt) ? null : dt;
}

// So sánh tên: ưu tiên firstName, tie-break bằng lastName
function compareName(a, b, dir = "asc") {
  const af = normalize(a.firstName);
  const bf = normalize(b.firstName);
  if (af !== bf)
    return dir === "asc" ? af.localeCompare(bf) : bf.localeCompare(af);

  const al = normalize(a.lastName);
  const bl = normalize(b.lastName);
  return dir === "asc" ? al.localeCompare(bl) : bl.localeCompare(al);
}

// So sánh ngày sinh (cũ→mới là asc)
function compareDob(a, b, dir = "asc") {
  const da = parseDob(a.dob);
  const db = parseDob(b.dob);
  const at = da ? da.getTime() : -Infinity; // thiếu dob → đầu danh sách khi asc
  const bt = db ? db.getTime() : -Infinity;
  return dir === "asc" ? at - bt : bt - at;
}

// === FIXED: sort đúng theo yêu cầu ===
function sortData(data) {
  const val = sortSel.value;
  const copy = [...data];

  switch (val) {
    case "name":
      copy.sort((a, b) => compareName(a, b, "asc"));
      break;
    case "name_desc":
      copy.sort((a, b) => compareName(a, b, "desc"));
      break;
    case "dob": // cũ → mới
      copy.sort((a, b) => compareDob(a, b, "asc"));
      break;
    case "dob_desc": // mới → cũ
      copy.sort((a, b) => compareDob(a, b, "desc"));
      break;
  }
  return copy;
}

// === FIXED: search chỉ theo firstName + phone ===
function searchFilter(list) {
  const kw = normalize(kwInput.value.trim());
  if (!kw) return list;
  return list.filter((st) => {
    const inFirstName = normalize(st.firstName).includes(kw);
    const inPhone = normalize(st.phone).includes(kw);
    return inFirstName || inPhone;
  });
}

function render(list) {
  tbody.innerHTML = "";
  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8">Không có dữ liệu</td></tr>';
    return;
  }
  list.forEach((st, idx) => {
    const tr = document.createElement("tr");
    const link = `/html/layout/main.html?page=student-classes&studentId=${st.id}`;
    const joinedCount = st.classes.length;
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${st.lastName}</td>
      <td>${st.firstName}</td>
      <td>${st.dob}</td>
      <td>${st.phone}</td>
      <td>${st.email}</td>
      <td><button class="btn btn-outline-primary btn-sm btn-show-classes" data-id="${
        st.id
      }" data-bs-toggle="modal" data-bs-target="#popupLopHoc">${joinedCount} lớp</button></td>
      <td><a class="action-link" href="${link}">Mở màn hình lớp của học viên</a></td>
    `;
    tbody.appendChild(tr);
  });
}

function refresh() {
  const filtered = searchFilter(students);
  const sorted = sortData(filtered);
  render(sorted);
}

searchBtn.addEventListener("click", refresh);
sortSel.addEventListener("change", refresh);
kwInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") refresh();
});

// Modal xem các lớp đã tham gia
(function setupStudentClassesModal() {
  const popup = document.getElementById("popupLopHoc");
  const listEl = document.getElementById("studentClassesList");
  let currentId = null;
  popup.addEventListener("show.bs.modal", (ev) => {
    currentId = Number(ev.relatedTarget.getAttribute("data-id"));
    const st = students.find((s) => s.id === currentId);
    const classes = st?.classes || [];
    listEl.innerHTML = "";
    if (classes.length === 0) {
      listEl.innerHTML =
        '<li class="list-group-item">Chưa tham gia lớp nào</li>';
      return;
    }
    classes.forEach((c) => {
      const li = document.createElement("li");
      li.className =
        "list-group-item d-flex justify-content-between align-items-center";
      const href = `/html/layout/main.html?page=classes&classId=${c.id}`;
      li.innerHTML = `<span>${c.name}</span><a class="btn btn-sm btn-outline-secondary" href="${href}">Quản lý buổi học</a>`;
      listEl.appendChild(li);
    });
  });
})();

// init
refresh();
