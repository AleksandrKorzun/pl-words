# Сборка игры
При создании проекта
1. Без использования CLI
	```
	git submodule add git@gitlab.com:episode/web/playable-ads/ads_builder.git core
	//в файл .gitmodules добавляем branch = version/*.*.* с нужной версией кора
	git submodule update --remote
	```
	Если проект уже был создан
	```
	git submodule init
	git submodule update --remote
	```
	Далее
	```
	node core/install.js // перенос файлов из кора
	npm i // установка зависимостей
	npm run dev // сборка для разработки игры
	npm run prod // билд игры под разные рекламные платформы
	```
2. С помощью CLi
	- Виконуємо в терміналі npx holy-playable create --token your_token
    	1. назва папки === назва репозиторію в Gitlab
    	2. зазначаємо необхідну версію