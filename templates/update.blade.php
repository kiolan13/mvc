
<head>
    <link href="/style/style.css" rel="stylesheet" type="text/css">
        <link href="/style/trix.css" rel="stylesheet" type="text/css">
            <script src="/script/jquery-3.3.1.min.js">
            </script>
            <script src="/script/trix.js">
            </script>
        </link>
    </link>
</head>
<body>
<a href="/">localhost </a><a href="/admin"> admin</a><a href="/admin/list"> list</a>
<h2 id='pagedescription'>
    Update product
</h2>
<div id="info"></div>
    <div class="basediv">
        <br>
            <input id="id" type="hidden" value="{{$intId}}">
            <label for="name">
                Name:
            </label>
            <input id="name" type="text" value="{{$strName}}" />
            <br>
                <label for="price">
                    Price:
                </label>
                <input id="price" type="text" value="{{$doublePrice}}" />
                <br>
                    <label for="description">
                        Description:
                    </label>
                    <div class="description" id="description">
                        <form …="">
                            <input id="x" value="{{$strDescription}}" name="content" type="hidden">
                                <trix-editor input="x">
                                </trix-editor>
                            </input>
                        </form>
                    </div>
                    <br>
                        <img class="image"/>
                        <br>
                        </br>
                    </br>
                </br>
            </br>
        </br>
    </div>
    <label class="customuploadlabel" for="loadImage">
        Custom Upload
    </label>
    <input class="loadImageButton" id="loadImage" type="file" value="load image"/>
    <br>
        <input class="saveButton" type="button" value="Save"/>
    </br>
</body>
<script src="/script/update.js" type="text/javascript">
</script>
