import { $ } from "./utils/dom.js";
import store from "./store/index.js";
// TODO 서버 요청 부분
// - [x] 웹 서버를 띄운다.
// - [] 서버에 새로운 메뉴명이 추가될 수 있도록 요청한다.
// - [] 서버에 카테고리별 메뉴리스트를 불러온다.
// - [] 서버에 메뉴가 수정 될 수 있도록 요청한다.
// - [] 서버에 메뉴의 품절상태를 토글될 수 있도록 요청한다.
// - [] 서버에 메뉴가 삭제될 수 있도록 요청한다

// TODO 리팩터링 부분
// - [] localStorage에 저장하는 로직은 지운다.
// - [] fetch 비동기 api를 사용하는 부분을 async await을 사용하여 구현한다.

// TODO 사용자 경험
// - [] API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 alert으로 예외처리를 진행한다.
// - [] 중복되는 메뉴는 추가할 수 없다.

// fetch("url", option);
const BASE_URL = "http://localhost:3000/api";

function App() {
  // 메뉴가 여러개 이므로, 배열로서 초기화함
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };

  this.currentCategory = "espresso";
  this.init = () => {
    // 로컬스토리지에 1개 이상의 데이터가 있다면, 있는 메뉴를 this.menu에 가져옴
    if (store.getLocalStorage()) {
      this.menu = store.getLocalStorage();
    }
    render();
    initEventListeners();
  };

  const render = () => {
    // 메뉴별로 마크업을 하기 위해 map이라는 메서드 사용
    const template = this.menu[this.currentCategory]
      .map((menuItem, index) => {
        return `<li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
			<span class="w-100 pl-2 menu-name ${menuItem.soldOut ? "sold-out" : ""}">${
          menuItem.name
        }</span>
        <button
        type="button"
        class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
      >
        품절
      </button>
      <button
        type="button"
        class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
      >
        수정
      </button>
      <button
        type="button"
        class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
      >
        삭제
      </button
		</li>`;
      })
      .join("");
    $("#menu-list").innerHTML = template;
    updateMenuCount();
  };

  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${menuCount} 개`;
  };

  const addMenuName = async () => {
    if ($("#menu-name").value === "") {
      alert("값을 입력해주세요");
      return;
    }

    const menuName = $("#menu-name").value;

    await fetch(`${BASE_URL}/category/${this.currentCategory}/menu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: menuName }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
      });

    await fetch(`${BASE_URL}/category/${this.currentCategory}/menu`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        this.menu[this.currentCategory] = data;
        render();
        $("#menu-name").value = "";
      });

    // 객체로서 담음
    // this.menu[this.currentCategory].push({ name: menuName });

    // store라는 객체에 setLocalStorage 데이터를 담음
    // store.setLocalStorage(this.menu);

    // 리스트에 새로운 메뉴를 추가 (기존 내용을 덮어쓰지 않도록 insertAdjacentHTML 사용)
    // $("#menu-list").insertAdjacentHTML("beforeend", menuItemTemplate(menuName));

    // render();
    // $("#menu-name").value = "";
  };

  const updatedMenuName = (e) => {
    // data 속성을 부여한 후, dataset이라는 속성으로 접근 가능
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);

    this.menu[this.currentCategory][menuId].name = updatedMenuName;
    // 데이터를 변경하는 것은 최소한으로 해야함. 여러군데서 데이터를 변경할 수 있으면, 데이터 상태가 꼬일 수 있음
    // localStorage.setItem(this.menu) X
    store.setLocalStorage(this.menu);
    render();
  };

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      // 리스트 내용 전체가 삭제되어야함
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);
      render();
    }
  };

  const soldOutMenu = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut =
      !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);
    render();
  };

  const initEventListeners = () => {
    $("#menu-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("menu-edit-button")) {
        updatedMenuName(e);
        return;
      }

      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e);
        return;
      }

      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        return;
      }
    });

    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    $("#menu-submit-button").addEventListener("click", addMenuName);

    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key !== "Enter") {
        return;
      }
      addMenuName();
    });

    $("nav").addEventListener("click", (e) => {
      const isCategoryButton =
        e.target.classList.contains("cafe-category-name");
      // 예외처리
      if (isCategoryButton) {
        const categoryName = e.target.dataset.categoryName;
        this.currentCategory = categoryName;
        $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
        render();
      }
    });
  };
}

// App 함수가 일반 함수로 호출될 때 this가 window 객체를 가리키게 되어 문제가 발생
// App을 객체 형태로 호출할 수 있도록 클래스나 new 키워드를 사용
const app = new App();
app.init();
