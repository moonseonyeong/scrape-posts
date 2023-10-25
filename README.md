# scrape-posts

### 벨로그 게시글 스크랩해서 DB에 저장하기

### scraperVelogPosts

- puppeteer를 이용하여 velog 페이지를 엽니다.
- `scrollToBottom`
  - 페이지 하단부로 이동하여 작성한 게시글을 전부 페이지에 받아옵니다.
- `getPostLinks`
  - selector를 이용하여 각 게시글의 주소를 배열로 받아옵니다.
- `scrapePosts`
  - for문을 이용하여 link마다 페이지를 새로 띄워 필요한 값들을 selector를 통해 배열로 받아옵니다.
  - title
    - h1 태그의 textContent 값을 받아옵니다.
  - content
    - className을 통해 내용 전체의 innerHTML 값을 받아옵니다.
  - cratedAt
    - 게시글이 작성된 지 7일이 지나지 않은 케이스를 `includes`를 이용하여 분기처리하고 작성일자를 `yyyy년 mm월 dd일` 형식으로 받아옵니다.
  - like
    - like button에서 span element의 값을 받아옵니다.
- saveDatabase
  - mysql createConnection을 이용해 DB와 연결합니다.
  - posts를 for..of 문을 통해 각 게시글마다 DB에 저장합니다.
  - INSERT INTO 쿼리문을 작성하고 execute를 통해서 쿼리를 실행합니다.
