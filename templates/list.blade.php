<head>
    <link href="/style/style.css" rel="stylesheet" type="text/css"/>
    <script src="/script/jquery-3.3.1.min.js">
    </script>

</head>
<body>
	<a href="/">localhost </a><a href="/admin"> admin</a><a href="/admin/list"> list</a>
	<h2 id="pagedescription">List of products</h2>
	<div id="info"></div>
	<div id='listholder'>
		<table>
		@foreach($list as $item)

			<tr class='trStyle' id="{{$item['id']}}"><td>{{$item['name']}}</td> <td>{{$item['price']}}</td> <td>{{$item['description']}}</td><td> <input type="button" class="editButton" value="edit"/></td><td><input type="button" class="deleteButton" value="delete"/></td></tr>


		@endforeach
		</table>
	</div>
	 <script type="text/javascript" src="/script/list.js"></script>
</body>
