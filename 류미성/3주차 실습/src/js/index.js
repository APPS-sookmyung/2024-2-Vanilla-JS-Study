//TODO localStorage Read & Write
// - [x] localStorage에 데이터를 저장한다.
// - [x] 메뉴를 추가할 때 저장
// - [x] 메뉴를 수정할 때 저장
// - [x] 메뉴를 삭제할 때 저장
// - [x] localStorage에 있는 데이터를 읽어온다.

//TODO 카테고리별 메뉴판 관리
// - [] 에스프레소 메뉴판 관리
// - [] 프라푸치노 메뉴판 관리
// - [] 블렌디드 메뉴판 관리
// - [] 티바나 메뉴판 관리
// - [] 디저트 메뉴판을 관리

// TODO 페이지 접근시 최초 데이터 Read & Rendering
// - [] 페이지에 최초로 로딩될 때 localStorage에 에스프레소 메뉴를 읽어온다.
// - [] 에스프레소 메뉴를 페이지에 그려준다.

// TODO 품절 상태 관리
// - [] 품절 상태인 경우를 보여줄 수 있게, 풀절 버튼을 추가하고 sold-out class를 추가하여 상태를 변경한다.
// - [] 품절 버튼을 추가한다
// - [] 품절 버튼을 클릭하면 localStorage에 상태값이 저장된다.
// - [] 클릭이벤트에서 가장 가까운 li태그의 class 속성 값에 sold-out을 추가한다.

const $ = (selector) => document.querySelector(selector);

// 로컬스토리지에는 문자열 형태로만 저장하기. object 형태로 그대로 저장해서 관리할 수 없음.
// JSON 객체 형태를 문자열로 저장하기 위해, 사용하는 메서드가 JSON.stringify()
// 해당 JSON 객체를 문자열로 저장가능
const store = {
	setLocalStorage(menu) {
		// localStorage.setItem("menu", menu) X
		// 저장은 문자열로 하고,
		return localStorage.setItem("menu", JSON.stringify(menu));
	},

	getLocalStorage() {
		// 데이터를 불러올때는 parse 하기
		return JSON.parse(localStorage.getItem("menu"));
	},
};

function App() {
	// 상태는 변할 수 있는 데이터 (메뉴명)
	// 갯수는 배열로 있으면 자동으로 구할 수 있기 때문에, 로컬스토리지에서 굳이 관리할 필요는 없음 (관리: 저장하고 읽어오기)
	// 데이터는 우리가 꼭 관리해야하는 것만 관리해야함. 그렇지 않으면 코드가 복잡해짐

	// 메뉴가 여러개 이므로, 배열로서 초기화함
	this.menu = [];
	this.init = () => {
		// 로컬스토리지에 1개 이상의 데이터가 있다면, 있는 메뉴를 this.menu에 가져옴
		if (store.getLocalStorage().length >= 1) {
			this.menu = store.getLocalStorage();
		}
		render();
	};

	const render = () => {
		// 메뉴별로 마크업을 하기 위해 map이라는 메서드 사용
		const template = this.menu
			.map((menuItem, index) => {
				return `<li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
			<span class="w-100 pl-2 menu-name">${menuItem.name}</span>
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
			</button>
		</li>`;
			})
			.join("");
		$("#espresso-menu-list").innerHTML = template;
		updateMenuCount();
	};

	const updateMenuCount = () => {
		const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
		$(".menu-count").innerText = `총 ${menuCount} 개`;
	};

	const addMenuName = () => {
		if ($("#espresso-menu-name").value === "") {
			alert("값을 입력해주세요");
			return;
		}

		const espressoMenuName = $("#espresso-menu-name").value;

		// 객체로서 담음
		this.menu.push({ name: espressoMenuName });

		// store라는 객체에 setLocalStorage 데이터를 담음
		store.setLocalStorage(this.menu);

		// 리스트에 새로운 메뉴를 추가 (기존 내용을 덮어쓰지 않도록 insertAdjacentHTML 사용)
		// $("#espresso-menu-list").insertAdjacentHTML("beforeend", menuItemTemplate(espressoMenuName));

		render();
		$("#espresso-menu-name").value = "";
	};

	const updatedMenuName = (e) => {
		// data 속성을 부여한 후, dataset이라는 속성으로 접근 가능
		const menuId = e.target.closest("li").dataset.menuId;
		const $menuName = e.target.closest("li").querySelector(".menu-name");
		const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);

		this.menu[menuId].name = updatedMenuName;
		// 데이터를 변경하는 것은 최소한으로 해야함. 여러군데서 데이터를 변경할 수 있으면, 데이터 상태가 꼬일 수 있음
		// localStorage.setItem(this.menu) X
		store.setLocalStorage(this.menu);

		// 가장 가까이에 있는 li를 가져와서 메뉴명을 수정한다
		$menuName.innerText = updatedMenuName;
	};

	const removeMenuName = (e) => {
		if (confirm("정말 삭제하시겠습니까?")) {
			// 리스트 내용 전체가 삭제되어야함
			const menuId = e.target.closest("li").dataset.menuId;
			this.menu.splice(menuId, 1);
			store.setLocalStorage(this.menu);
			e.target.closest("li").remove();
			updateMenuCount();
		}
	};

	$("#espresso-menu-list").addEventListener("click", (e) => {
		if (e.target.classList.contains("menu-edit-button")) {
			updatedMenuName(e);
		}

		if (e.target.classList.contains("menu-remove-button")) {
			removeMenuName(e);
		}
	});

	$("#espresso-menu-form").addEventListener("submit", (e) => {
		e.preventDefault();
	});

	$("#espresso-menu-submit-button").addEventListener("click", addMenuName);

	$("#espresso-menu-name").addEventListener("keypress", (e) => {
		if (e.key !== "Enter") {
			return;
		}
		addMenuName();
	});
}

// App 함수가 일반 함수로 호출될 때 this가 window 객체를 가리키게 되어 문제가 발생
// App을 객체 형태로 호출할 수 있도록 클래스나 new 키워드를 사용
const app = new App();
app.init();
