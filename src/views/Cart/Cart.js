// 🚫 장바구니 테스트용 더미 데이터 (id, 상품이름, 수량, 이미지주소, 가격, 수량계산된 가격)
let data = [
	{
		id: 1,
		title: '상품1',
		amount: 1,
		imageUrl: '/',
		price: 1000,
		totalPrice: 1000,
	},
	{
		id: 2,
		title: '상품2',
		amount: 1,
		imageUrl: '/',
		price: 2000,
		totalPrice: 2000,
	},
	{
		id: 3,
		title: '상품3',
		amount: 1,
		imageUrl: '/',
		price: 3000,
		totalPrice: 3000,
	},
];

// checkJWTTokenInCookie를 공통 js로 만들어서 header,footer 불러올때 함께 사용하면 좋을 듯 함
// 쿠키에서 JWT 토큰 확인
function checkJWTTokenInCookie() {
	const cookies = document.cookie.split(';'); // 모든 쿠키 가져오기
	// console.log(cookies);
	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i].trim();
		// JWT 토큰 쿠키인지 확인
		if (cookie.startsWith('jwt=')) {
			const jwtToken = cookie.split('=')[1]; // JWT 토큰 값 가져오기
			// 토큰이 유효한지 여부 확인
			if (validateJWTToken(jwtToken)) {
				return true; // 유효한 토큰이 존재함
			}
		}
	}
	return false; // 토큰이 없거나 유효하지 않음
}

// JWT 토큰 유효성 검사 로직
function validateJWTToken(jwtToken) {
	// 예를 들어, 토큰의 시그니처 검증, 만료 여부 확인 등을 수행
	// 유효한 토큰이면 true, 그렇지 않으면 false 반환
	// 실제 구현은 JWT 라이브러리를 사용하거나 직접 로직을 작성
	return true; // 임시로 항상 유효한 토큰으로 가정
}

// 쿠키에서 JWT 토큰 확인
const hasToken = checkJWTTokenInCookie();
const guestModeEl = document.querySelector('#guest-mode');

if (hasToken) {
	console.log('JWT 토큰이 쿠키에 존재합니다.');
	guestModeEl.innerText = '';
} else {
	console.log('JWT 토큰이 쿠키에 존재하지 않습니다.');
	guestModeEl.innerText = '비회원으로';
}

// 테스트용 JWT 토큰 생성 함수
function setCookie(name, value, days) {
	const expires = new Date();
	expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
	const expiresStr = expires.toUTCString();
	document.cookie =
		name +
		'=' +
		encodeURIComponent(value) +
		'; expires=' +
		expiresStr +
		'; path=/';
}

// 테스트용 JWT 토큰
const jwtToken = 'your-jwt-token';

// 🚫 테스트용 요소 생성(삭제예정)
const wrap = document.querySelector('#cart-wrap');
const testDiv = document.createElement('div');
testDiv.setAttribute('style', 'display: flex;justify-content: space-between;');
wrap.prepend(testDiv);

// 🚫 테스트용 토큰 생성 버튼(삭제예정)
const tokenBtn = document.createElement('button');
tokenBtn.setAttribute('style', 'background:#000;color:#fff;padding:2px 10px;');
tokenBtn.innerText = '테스트용 토큰 생성';
testDiv.prepend(tokenBtn);
function importToken() {
	// JWT 토큰을 쿠키에 설정
	setCookie('jwt', jwtToken, 7); // 7일 동안 유효한 쿠키로 설정
}
tokenBtn.addEventListener('click', importToken);

// 🚫 테스트용 더미데이터 불러오기 버튼(삭제예정)
const dummyBtn = document.createElement('button');
dummyBtn.setAttribute('style', 'background:#000;color:#fff;padding:2px 10px;');
dummyBtn.innerText = '테스트용 더미데이터 생성';
testDiv.prepend(dummyBtn);
function importDummyProducts() {
	localStorage.setItem(PRODUCT_KEY, JSON.stringify(data));
}
dummyBtn.addEventListener('click', importDummyProducts);

// 👉 개발 시작 코드
const PRODUCT_KEY = 'cartProducts';

// 로컬스토리지 장바구니 데이터
let products = JSON.parse(localStorage.getItem(PRODUCT_KEY));
// 상품 리스트 요소
const itemsList = document.querySelector('.cart-items > ul');
let items = '';
const cartPriceBox = document.querySelector('.cart-price');

// 주문하기 버튼 이동
const orderBtn = document.querySelector('.order-btn');
orderBtn.addEventListener('click', () => {
	console.log('주문하기');
	// 확인용 경로
	window.location.href = '/orders';
});

// 로컬스토리지 장바구니 데이터 유무 확인
if (products?.length > 0) {
	console.log('장바구니에 상품 있음');
	products.map(getProducts);
} else {
	console.log('장바구니에 상품 없음');
	emptyProducts();
}

// 장바구니 비었을 때
function emptyProducts() {
	const emptyItems = itemsList.parentElement;
	const cartControl = document.querySelector('.cart-control-btn').children;
	[...cartControl].map(el => (el.style.display = 'none'));
	emptyItems.innerHTML =
		'<span class="empty-items">장바구니에 담으신 상품이 없습니다. 🥲</span>';
	// 금액정보 안보이게
	cartPriceBox.style.display = 'none';
	// 주문 불가
	orderBtn.setAttribute('disabled', 'disabled');
}

// 장바구니 상품들 화면 그려주기
function getProducts(newProducts) {
	const newItem = `<li>
			<article>
				<div class="thumbnail">
					<input type="checkbox" id="${newProducts.id}" name="cart-item-check" checked />
					<label for="${newProducts.id}">
						<img src="${newProducts.imageUrl}" alt="${newProducts.title}" />
						${newProducts.title}
					</label>
				</div>
				<div class="amount-info">
					<div class="amount-btns">
						<button type="button" class="subtracting">-</button>
						<input
							type="number"
							class="amount"
							value="${newProducts.amount}"
							min="1"
						/>
						<button type="button" class="adding">+</button>
					</div>
					<div>&#215; <span>${newProducts.price.toLocaleString()}</span>원</div>
				</div>
				<div><span class="product-price">${newProducts.totalPrice.toLocaleString()}</span>원</div>
			</article>
			<button type="button" class="delete-btn">삭제</button>
			</li>`;
	items += newItem;
	itemsList.innerHTML = items;
}

// 전체선택 요소
const allChecked = document.querySelector('input#all-checked');
// 개별선택 요소
const itemsCheck = document.querySelectorAll('input[name=cart-item-check]');
// 선택된 상품금액
const productsPrice = document.querySelector('#products-price');
// 배송비
const shippingPrice = document.querySelector('#shipping-price');
let shippingPriceNumber = 0;
// 결제예정금액
const orderPrice = document.querySelector('#order-price');
// 상품 아이템
const cartItems = itemsList.querySelectorAll('li');

cartUpdate();

// 체크여부 확인해서 체크된 것들만 필터링
function checkedProducts(items) {
	return [...items].filter(item => item.checked);
}

// 선택 상품들 삭제
const checkedDelBtn = document.querySelector('#checked-delete');
checkedDelBtn.addEventListener('click', () => {
	const deleteProducts = checkedProducts(itemsCheck);

	const checkedProductsArr = [];

	deleteProducts.map(product => {
		checkedProductsArr.push(Number(product.id));
		const li = product.closest('li');
		li.remove();
	});

	products = products.filter(obj => !checkedProductsArr.includes(obj.id));
	localStorage.setItem(PRODUCT_KEY, JSON.stringify(products));
	alert('삭제되었습니다!');

	// 남은 상품들 다시 전체선택
	const remainingProducts = [...itemsCheck].filter(item => !item.checked);
	remainingProducts.map(product => (product.checked = true));
	cartUpdate();

	if (products.length <= 0) {
		emptyProducts();
	}
});

// 선택 상품들 업데이트
function cartUpdate() {
	const updateProducts = checkedProducts(itemsCheck);

	// 개별선택 모두 선택되었을때 전체선택 체크유무 제어
	updateProducts.length !== itemsCheck.length
		? (allChecked.checked = false)
		: (allChecked.checked = true);

	// 상품금액, 배송비, 결제예정금액 변경
	let totalPrice = 0;
	if (updateProducts.length === 0) {
		totalPrice = 0;
		shippingPriceNumber = 0;
	} else {
		shippingPriceNumber = 3000;
	}
	for (let i = 0; i < updateProducts.length; i++) {
		products.map(product => {
			if (product.id === Number(updateProducts[i].id)) {
				totalPrice += product.totalPrice;
			}
		});
	}
	productsPrice.innerText = `${totalPrice.toLocaleString()} 원`;
	shippingPrice.innerText = `${shippingPriceNumber.toLocaleString()} 원`;
	orderPrice.innerText = `${(
		totalPrice + shippingPriceNumber
	).toLocaleString()} 원`;
}

// 전체선택 시 금액 업데이트
allChecked.addEventListener('click', () => {
	// 전체선택 시 개별선택 제어
	[...itemsCheck].map(item => {
		!allChecked.checked ? (item.checked = false) : (item.checked = true);
	});
	console.log('전체선택 시 금액 업데이트');
	cartUpdate();
});

// 장바구니 상품 수량, 가격 변경, 삭제
function itemUpdate(item) {
	// 수량
	const amountInput = item.querySelector('input.amount');
	let amountValue = Number(amountInput.value);
	const addingBtn = item.querySelector('button.adding');
	const subtractingBtn = item.querySelector('button.subtracting');

	// 가격
	const itemCheck = item.querySelector('input[type=checkbox]');
	const itemPrice = item.querySelector('.product-price');

	// 수량*가격 계산
	const amountCalc = product => {
		if (product.id === Number(itemCheck.id)) {
			product.amount = Number(amountInput.value);
			product.totalPrice = product.price * product.amount;
			itemPrice.innerText = product.totalPrice.toLocaleString();
		}
		localStorage.setItem(PRODUCT_KEY, JSON.stringify(products));
	};

	// 개별삭제
	const deleteBtn = item.querySelector('button.delete-btn');
	deleteBtn.addEventListener('click', e => {
		const li = e.target.parentElement;
		li.remove();
		products = products.filter(obj => obj.id !== Number(itemCheck.id));
		localStorage.setItem(PRODUCT_KEY, JSON.stringify(products));
		cartUpdate();

		if (products.length <= 0) {
			emptyProducts();
		}
	});

	// 개별선택 시 금액 업데이트
	itemCheck.addEventListener('click', () => {
		console.log('개별 선택 시 금액 업데이트');
		cartUpdate();
	});

	// 수량 증가
	addingBtn.addEventListener('click', () => {
		amountValue += 1;
		amountInput.value = amountValue;
		products.map(amountCalc);
		cartUpdate();
	});
	// 수량 감소
	subtractingBtn.addEventListener('click', () => {
		amountValue -= 1;
		if (amountInput.value < 2) {
			amountValue = 1;
			alert('최소 수량은 1개 입니다!');
		}
		amountInput.value = amountValue;
		products.map(amountCalc);
		cartUpdate();
	});
	// 수량 직접 입력
	amountInput.addEventListener('change', e => {
		e.preventDefault();
		if (e.target.value < 1) {
			e.target.value = 1;
			alert('최소 수량은 1개 입니다!');
		}
		amountValue = Number(e.target.value);
		products.map(amountCalc);
		cartUpdate();
	});
}
[...cartItems].map(itemUpdate);
