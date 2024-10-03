// step1 요구사항 구현을 위한 전략
// TODO 메뉴 추가
// - [x] 메뉴의 이름을 입력 받고 엔터키 입력으로 추가한다.
// - [x] 메뉴의 이름을 입력 받고 확인 버튼을 클릭하면 메뉴를 추가한다.
// - [x] 추가되는 메뉴의 마크업은 '<ul id="espresso-menu-list" class="mt-3 pl-0"></ul>' 안에 삽입해야 한다.
// - [x] 총 메뉴 갯수를 count하여 상단에 보여준다.
// - [x] 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
// - [x] 사용자 입력값이 빈 값이라면 추가되지 않는다.

// 달러표시는 js에서 DOM 엘리먼트, HTML DOM 엘리먼트를 가져올 때 관용적으로 사용한다.
const $ = (selector) => document.querySelector(selector);

function App() {
    // form 태그가 자동으로 전송되는 것을 막아줍니다.
    $("#espresso-menu-form").addEventListener("submit", (e) => {
        e.preventDefault();
    });

    // 메뉴 개수를 업데이트하는 함수
    const updateMenuCount = () => {
        const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
        $(".menu-count").innerText = `총 ${menuCount}개`;
    };

    // 메뉴를 추가하는 함수
    const addMenuName = () => {
        const menuNameInput = $("#espresso-menu-name").value;
        if (menuNameInput === "") {
            alert("값을 입력해주세요.");
            return;
        }

        const menuItemTemplate = (espressoMenuName) => {
            return `
            <li class="menu-list-item d-flex items-center py-2">
                <span class="w-100 pl-2 menu-name">${espressoMenuName}</span>
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

        // 메뉴 리스트에 새로운 항목 추가
        $("#espresso-menu-list").insertAdjacentHTML(
            "beforeend",
            menuItemTemplate(menuNameInput)
        );

        // 입력 필드 초기화
        $("#espresso-menu-name").value = "";

        // 메뉴 개수 업데이트
        updateMenuCount();
    };

    // 버튼 클릭 시 메뉴 추가
    $("#espresso-menu-submit-button").addEventListener("click", () => {
        addMenuName();
    });

    // Enter 키를 눌렀을 때 메뉴 추가
    $("#espresso-menu-name").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            addMenuName();
        }
    });
}

// 앱 초기화
App();
