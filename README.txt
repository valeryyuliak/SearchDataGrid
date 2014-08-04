Интегрированная функциональность:
1. Добавление "+" новой записи в список.
2. Отображение данных в таблице.
3. Удаление выбранных строк с помощью "-" кнопки.
4. Отображение записей, содержащих слово/слова, введенных в тестовое поле.
5. Сортировка записей по каждому полю.

Для использования нужно:
1. Подключить dojo строкой: 
<script src='http://ajax.googleapis.com/ajax/libs/dojo/1.8.0/dojo/dojo.js'></script>
подключить стандартную тему claro:
<link rel="stylesheet" type="text/css" href="http://ajax.googleapis.com/ajax/libs/dojo/1.6/dijit/themes/claro/claro.css" />
<link rel="stylesheet" type="text/css" href="http://ajax.googleapis.com/ajax/libs/dojo/1.6/dojox/grid/resources/claroGrid.css" />
подключить стили:
<link rel="stylesheet" type="text/css" href="./include/SearchDataGrid.css" />
подключить код:
<script src="./include/SearchDataGrid.js" type="text/javascript"></script>
2. Для создания списка данных необходимо создать объект, например:
var grid1 = new SearchDataGrid("gridDiv1", "Grid1", ["FirstName", "LastName"]);
где первый параметр - это имя div'а, в котором будет распологаться список данных;
второй параметр - имя таблицы, в которой будут отображаться введенные данные;
третий параметр - это массив, который содержит список имен столбцов.
