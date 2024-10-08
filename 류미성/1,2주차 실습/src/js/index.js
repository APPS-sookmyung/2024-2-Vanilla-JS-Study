// step1 요구사항 구현을 위한 전략

// TODO 메뉴 추가
// - [x] 메뉴의 이름을 입력받고 확인버튼을 누르면 메뉴가 추가된다.
// - [x] 메뉴의 이름을 입력 받고 확인 버튼을 클릭하면 메뉴를 추가한다.
// - [x] 메뉴의 이름을 입력받고 엔터키 입력으로 추가한다.
// - [x] 추가되는 메뉴의 마크업은 `<ul id="espresso-menu-list" class="mt-3 pl-0"></ul>` 안에 삽입해야 한다.
// - [x] 총 메뉴 갯수를 count하여 상단에 보여준다.
// - [x] 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
// - [x] 사용자 입력값이 빈 값이라면 추가되지 않는다.

// TODO 메뉴 수정
// - [x] 메뉴의 수정 버튼클릭 이벤트를 받고, 메뉴수정하는 모달창이 뜬다.
// - [] 모달창에서 신규 메뉴명을 입력 받고, 확인버튼을 누르면 메뉴가 수정된다.

// TODO 메뉴 삭제
// - [x] 메뉴 삭제버튼 클릭 이벤트를 받고, 메뉴 삭제 컨펌 모달창이 뜬다.
// - [x] 확인 버튼을 클릭하면 메뉴가 삭제된다.
// - [x] 총 메뉴 갯수를 count하여 상단에 보여준다.

// 달러표시는 JS에서의 DOM 엘리먼트, HTML DOM 엘레멘트를 가져올 때 관용적으로 사용
const $ = (selector) => document.querySelector(selector);

function App() {
	const updateMenuCount = () => {
		const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
		$(".menu-count").innerText = `총 ${menuCount} 개`;
	};

	// 재사용할 수 있는 함수 (코드 상단에 재배치)
	const addMenuName = () => {
		// input창이 빈 값인 경우, alert 창 띄우기
		const espressoMenuName = $("#espresso-menu-name").value;
		if (espressoMenuName === "") {
			alert("값을 입력해주세요");
			// early return을 통해 뒷부분이 수행되지 않도록 함
			return;
		}

		const menuItemTemplate = (name) => {
			return `<li class="menu-list-item d-flex items-center py-2">
					<span class="w-100 pl-2 menu-name">${name}</span>
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
		};

		// 리스트에 새로운 메뉴를 추가 (기존 내용을 덮어쓰지 않도록 insertAdjacentHTML 사용)
		$("#espresso-menu-list").insertAdjacentHTML("beforeend", menuItemTemplate(espressoMenuName));

		// 메뉴의 총 개수를 업데이트 (리팩토링)
		updateMenuCount();

		// 메뉴가 추가된 후, input 값을 초기화
		$("#espresso-menu-name").value = "";
	};

	// 리팩토링 전에는 코드를 읽어봐야 어떤 기능을 하는지 알수 있었지만, 함수명을 통해 알 수 있음
	// e 라는 이벤트 객체를 넣어줘야, 함수로 분리한 부분이 정상 작동 가능함
	const updateMenuName = (e) => {
		const $menuName = e.target.closest("li").querySelector(".menu-name");
		const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
		// 가장 가까이에 있는 li를 가져와서 메뉴명을 수정한다
		$menuName.innerText = updatedMenuName;
	};

	// 마찬가지로 이벤트 객체를 파라미터로 넘김
	const RemoveMenuName = (e) => {
		if (confirm("정말 삭제하시겠습니까?")) {
			// 리스트 내용 전체가 삭제되어야함
			e.target.closest("li").remove();
			updateMenuCount();
		}
	};

	$("#espresso-menu-list").addEventListener("click", (e) => {
		if (e.target.classList.contains("menu-edit-button")) {
			updateMenuName(e);
		}

		if (e.target.classList.contains("menu-remove-button")) {
			RemoveMenuName(e);
		}
	});
	// form 태그가 자동으로 전송되는 걸 막아준다 (새로고침 방지)
	$("#espresso-menu-form").addEventListener("submit", (e) => {
		e.preventDefault();
	});

	// 확인 버튼 클릭 이벤트 처리
	// 이벤트 객체를 사용하지 않는 경우, 코드 간소화 가능 (리팩토링)
	$("#espresso-menu-submit-button").addEventListener("click", addMenuName);

	// 메뉴 입력 시 Enter 키 입력 처리
	$("#espresso-menu-name").addEventListener("keypress", (e) => {
		// enter키를 누르지 않으면 함수 종료
		if (e.key !== "Enter") {
			return;
		}
		addMenuName();
	});
}

App();
