## Gin

### Gin基本使用

- #### 安装
  - `go get github.com/gin-gonic/gin`
  - #### 热加载
    - #### 安装
      - `go install github.com/pilu/fresh@latest`
    - #### 使用
      - `fresh`
- #### 实例
```go
package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func main() {
	// 创建一个默认的路由引擎
	r := gin.Default()
	// 配置路由
	r.GET("/", func(context *gin.Context) {
		context.String(200, "%v", "你好，世界")
	})
	
	// http.StatusOK = 200
	r.GET("/news", func(context *gin.Context) {
		context.String(http.StatusOK, "%v", "主要用于获取数据")
	})
	r.POST("/test", func(context *gin.Context) {
		context.String(200, "%v", "主要用于添加数据")
	})
	r.PUT("/edit", func(context *gin.Context) {
		context.String(200, "%v", "主要用于更新数据")
	})
	r.DELETE("/delete", func(context *gin.Context) {
		context.String(200, "%v", "主要用于删除数据")
	})
	
	// 启动HTTP服务，默认在0.0.0.0:8080 启动服务
	r.Run(":8000") // 参数修改端口
}
```

### 响应数据

- #### String JSON JSONP XML HTML

```go
package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func main() {
	r := gin.Default()
	
	// 配置模板文件路径
	r.LoadHTMLGlob("templates/*")

	r.GET("/", func(context *gin.Context) {
		context.String(http.StatusOK, "%v", "你好，世界")
	})
	// 1.json map类型响应
	r.GET("/json1", func(context *gin.Context) {
		context.JSON(http.StatusOK, map[string]interface{}{
			"success": http.StatusOK,
			"data":    "",
		})
	})
	// 2.json gin定义的map类型响应
	r.GET("/json2", func(context *gin.Context) {
		context.JSON(http.StatusOK, gin.H{
			"success": http.StatusOK,
			"data":    "",
		})
	})
	// 3.json 结构体类型响应
	type Article struct {
		Title   string `json:"title"`
		Desc    string `json:"desc"`
		Content string `json:"content"`
	}
	r.GET("/json3", func(context *gin.Context) {
		a := &Article{
			Title:   "Test Title",
			Content: "test Content",
			Desc:    "Test Desc",
		}
		context.JSON(http.StatusOK, a)
	})

	// 4.jsonp
	// http://127.0.0.1:8080/jsonp?callback=xxx
	// xxx({"title":"Test Title","desc":"Test Desc","content":"test Content"});
	r.GET("/jsonp", func(context *gin.Context) {
		a := &Article{
			Title:   "Test Title",
			Content: "test Content",
			Desc:    "Test Desc",
		}
		context.JSONP(http.StatusOK, a)
	})

	// 5.xml
	r.GET("/xml", func(context *gin.Context) {
		context.XML(http.StatusOK, gin.H{
			"success": http.StatusOK,
			"data":    "none",
		})
	})

	// 6.html 渲染模板
	r.GET("/html", func(context *gin.Context) {
		context.HTML(http.StatusOK, "index.html", gin.H{
			"title": "我是后台数据1",
		})
	})

	r.GET("/news", func(context *gin.Context) {
		context.HTML(http.StatusOK, "news.html", gin.H{
			"title": "我是后台数据2",
			"price": 20,
		})
	})

	r.Run(":8080")
}
```

### 模板渲染与模板语法

- #### 书接上文

- ##### 模板渲染和传值
```go
package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

type Article struct {
	Title   string
	Content string
}

func main() {
	r := gin.Default()

	// 加载模板
	r.LoadHTMLGlob("templates/**/*")

	// 前台
	r.GET("/", func(context *gin.Context) {
		context.HTML(http.StatusOK, "index/index.html", gin.H{
			"title": "首页",
			"score": 81,
			"hobby": []string{"吃饭", "睡觉", "写代码"},
			"newsList": []interface{}{
				&Article{
					Title:   "新闻标题1",
					Content: "新闻内容1",
				},
				&Article{
					Title:   "新闻标题2",
					Content: "新闻内容2",
				},
			},
			"testSlice": []string{},
			"news": &Article{
				Title:   "新闻标题",
				Content: "新闻内容",
			},
		})
	})
	r.GET("/news", func(context *gin.Context) {
		news := &Article{
			Title:   "新闻标题",
			Content: "新闻内容",
		}
		context.HTML(http.StatusOK, "index/news.html", gin.H{
			"title": "新闻页面",
			"news":  news,
		})
	})

	// 后台
	r.GET("/admin", func(context *gin.Context) {
		context.HTML(http.StatusOK, "admin/index.html", gin.H{
			"title": "后台首页",
		})
	})
	r.GET("/admin/news", func(context *gin.Context) {
		context.HTML(http.StatusOK, "admin/news.html", gin.H{
			"title": "新闻页面",
		})
	})

	r.Run(":8080")
}
```
- ##### html模板语法
```html
{{ define "default/index.html" }}
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>test</title>
</head>
<body>
  <h1>{{.title}}</h1>
<!--  定义变量 -->
  {{ $t := .title }}
  <h4>{{$t}}</h4>
<!-- 条件判断 -->
  {{if ge .score 60}}
  <p>及格</p>
  {{else}}
  <p>不及格</p>
  {{end}}

  {{if gt .score 90}}
  <p>优秀</p>
  {{else if gt .score 80}}
  <p>良好</p>
  {{else if gt .score 60}}
  <p>及格</p>
  {{else}}
  <p>不及格</p>
  {{end}}
<!-- 循环遍历数据 -->
  <ul>
    {{range $key,$value := .hobby}}
    <li>{{$key}}-{{$value}}</li>
    {{end}}
  </ul>

  <br>

  <ul>
    {{range $key,$value := .newsList}}
    <li>{{$key}}-{{$value.Title}}-{{$value.Content}}</li>
    {{end}}
  </ul>

  <br>

  <ul>
    {{range $key,$value := .testSlice}}
    <li>{{$key}}-{{$value.Title}}-{{$value.Content}}</li>
    {{else}}
    <li>切片中没有数据</li>
    {{end}}
  </ul>
<!-- with解构结构体 -->
  <p>{{.news.Title}}</p>
  <p>{{.news.Content}}</p>

  <br>

  {{with .news}}
    <p>{{.Title}}</p>
    <p>{{.Content}}</p>
  {{end}}
</body>
</html>
{{ end }}
```

- #### 书接下文

- ##### 模板渲染和语法

```go
package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"html/template"
	"net/http"
	"time"
)

type Article struct {
	Title   string
	Content string
}

// 时间戳转换日期
func UnixToTime(timestamp int) string {
	t := time.Unix(int64(timestamp), 0)
	return t.Format("2006-01-02 15:04:05")
}

func Println(str1 string, str2 string) string {
	fmt.Println(str1, str2)
	return str1 + str2
}

func main() {
	r := gin.Default()

	// 自定义模板函数, 要把函数放在加载模板前
	r.SetFuncMap(template.FuncMap{
		"UnixToTime": UnixToTime,
		"Println":    Println,
	})

	// 配置静态web目录 第一个参数表示路由，第二个参数表示映射的目录
	r.Static("/static", "./static")

	// 加载模板
	r.LoadHTMLGlob("templates/**/*")

	// 前台
	r.GET("/", func(context *gin.Context) {
		context.HTML(http.StatusOK, "index/index.html", gin.H{
			"title": "首页",
			"date":  1629423555,
		})
	})
	r.GET("/news", func(context *gin.Context) {
		news := &Article{
			Title:   "新闻标题",
			Content: "新闻内容",
		}
		context.HTML(http.StatusOK, "index/news.html", gin.H{
			"title": "新闻页面",
			"news":  news,
		})
	})
	r.Run(":8080")
}
```

- #### html模板语法
```html
{{ define "public/header.html" }}
  <h1>我是公共头部-{{.title}}</h1>
{{end}}
```

```html
{{ define "default/index.html" }}
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>test</title>
  <link rel="stylesheet" href="/static/css/common.css">
</head>
<body>
<!-- 嵌套使用公共模板 -->
  {{ template "public/header.html" .}}

  <h2>css生效了</h2>
<!--加载图片-->
  <img src="/static/images/yun.jpg" alt="">

<!--  预定义函数 (了解) -->
  <p>{{len .title}}</p>

<!--  自定义模板函数 -->
  <p>{{.date}}</p>
  <p>{{UnixToTime .date}}</p>
  <p>{{Println .title .title}}</p>

</body>
</html>
{{ end }}
```

### 路由

- #### GET POST 传值
```go
package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"html/template"
	"net/http"
	"time"
)

func main() {
	r := gin.Default()

	// 配置静态web目录 第一个参数表示路由，第二个参数表示映射的目录
	r.Static("/static", "./static")

	// 加载模板
	r.LoadHTMLGlob("templates/**/*")

	// GET请求传值
	r.GET("/", func(context *gin.Context) {
		id := context.Query("id")
		name := context.Query("name")
		page := context.DefaultQuery("page", "1")
		context.JSON(http.StatusOK, gin.H{
			"id":   id,
			"name": name,
			"page": page,
		})
	})
	r.GET("/article", func(context *gin.Context) {
		id := context.DefaultQuery("id", "1") // GET配置默认值
		context.JSON(http.StatusOK, gin.H{
			"id":  id,
			"msg": "新闻详情",
		})
	})

	// POST传值
	r.GET("/user", func(context *gin.Context) {
		context.HTML(http.StatusOK, "index/user.html", gin.H{})
	})
	// 获取post表单数据
	r.POST("/doAddUser", func(context *gin.Context) {
		username := context.PostForm("username")
		password := context.PostForm("password")
		age := context.DefaultPostForm("age", "20")	// POST配置默认值
		context.JSON(http.StatusOK, gin.H{
			"username": username,
			"password": password,
			"age":      age,
		})
	})

	r.Run(":8080")
}
```

```html
{{ define "default/user.html" }}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Title</title>
</head>
<body>
  <form action="/doAddUser" method="post"><br><br>
    用户名: <input type="text" name="username"><br><br>
    密码:   <input type="password" name="password"><br><br>
    <input type="submit" value="提交">
  </form>
</body>
</html>
{{ end }}
```

- #### GET POST 传递的数据绑定到结构体
```go
package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"html/template"
	"net/http"
	"time"
)

func main() {
	r := gin.Default()
	
	
	// 获取GET POST 传递的数据绑定到结构体
	type UserInfo struct {
		Username string `json:"username" form:"username"`
		Password string `json:"password" form:"password"`
	}
	r.GET("/getUser", func(context *gin.Context) {
		user := &UserInfo{}
		err := context.ShouldBind(&user)
		if err != nil {
			context.JSON(http.StatusOK, gin.H{
				"err": err.Error(),
			})
		}
		context.JSON(http.StatusOK, user)
	})
	r.POST("/doAddUser", func(context *gin.Context) {
		user := &UserInfo{}
		err := context.ShouldBind(&user)
		if err != nil {
			context.JSON(http.StatusOK, gin.H{
				"err": err.Error(),
			})
		}
		context.JSON(http.StatusOK, user)
	})

	r.Run(":8080")
}
```

- #### 获取 Post Xml数据
```go
package main

import (
	"encoding/xml"
	"fmt"
	"github.com/gin-gonic/gin"
	"html/template"
	"net/http"
	"time"
)

func main() {
	r := gin.Default()

	// 获取post xml数据
	type Article struct {
		Title   string `json:"title" xml:"title"`
		Content string `json:"content" xml:"content"`
	}
	r.POST("/xml", func(context *gin.Context) {
		var article Article
		data, _ := context.GetRawData() // 读取请求数据
		if err := xml.Unmarshal(data, &article); err != nil {
			context.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
		}
		context.JSON(http.StatusOK, article)
	})

	r.Run(":8080")
}
```

- #### 动态路由传值
```go
package main

import (
  "github.com/gin-gonic/gin"
  "net/http"
)


func main() {
  r := gin.Default()

  r.GET("/user/:id", func(context *gin.Context) {
    id := context.Param("id")
    context.JSON(http.StatusOK, gin.H{
      "id": id,
    })
  })

  r.Run(":8080")
}
```

- #### 路由分组和路由抽离
```go
package main

import (
  "Gin-Note/routers"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  r.Static("/static", "./static")

  r.LoadHTMLGlob("templates/**/*")

  // 路由抽离
  routers.DefaultRoutersInit(r)
  routers.ApiRoutersInit(r)
  routers.AdminRoutersInit(r)

  r.Run(":8080")
}
```

```go
package routers

import (
  "github.com/gin-gonic/gin"
  "net/http"
)

func DefaultRoutersInit(r *gin.Engine) {
  // 路由分组
  defaultRouters := r.Group("/")
  {
    defaultRouters.GET("/", func(context *gin.Context) {
      context.HTML(http.StatusOK, "index/index.html", gin.H{})
    })
    defaultRouters.GET("/new", func(context *gin.Context) {
      context.String(200, "new")
    })
  }
}
```

```go
package routers

import "github.com/gin-gonic/gin"

func ApiRoutersInit(r *gin.Engine) {
	apiRouters := r.Group("/api")
	{
		apiRouters.GET("/", func(context *gin.Context) {
			context.String(200, "api")
		})
		apiRouters.GET("/list", func(context *gin.Context) {
			context.String(200, "list")
		})
	}
}
```

```go
package routers

import "github.com/gin-gonic/gin"

func AdminRoutersInit(r *gin.Engine) {
	adminRouters := r.Group("/admin")
	{
		adminRouters.GET("/", func(context *gin.Context) {
			context.String(200, "admin")
		})
		adminRouters.GET("/info", func(context *gin.Context) {
			context.String(200, "info")
		})
	}
}
```

### 控制器

- #### 自定义控制器和控制器分离

- main.go
```go
package main

import (
	"Gin-Note/routers"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.Static("/static", "./static")

	r.LoadHTMLGlob("templates/**/*")

	// 路由抽离
	routers.DefaultRoutersInit(r)
	routers.AdminRoutersInit(r)

	r.Run(":8080")
}
```

- routers
```go
package routers

import (
	"Gin-Note/controllers/index"
	"github.com/gin-gonic/gin"
)

func DefaultRoutersInit(r *gin.Engine) {
	// 路由分组
	defaultRouters := r.Group("/")
	{
		// 自定义控制器抽离
		defaultRouters.GET("/", index.DefaultController{}.Index)
		defaultRouters.GET("/new", index.DefaultController{}.New)
	}
}
```
```go
package routers

import (
	"Gin-Note/controllers/admin"
	"github.com/gin-gonic/gin"
)

func AdminRoutersInit(r *gin.Engine) {
	adminRouters := r.Group("/admin")
	{
		// 自定义控制器抽离
		adminRouters.GET("/", admin.IndexController{}.Index)
		adminRouters.GET("/user", admin.UserController{}.Index)
		adminRouters.GET("/user/add", admin.UserController{}.Add)
		adminRouters.GET("/user/edit", admin.UserController{}.Edit)
		adminRouters.GET("/user/del", admin.UserController{}.Delete)
	}
}
```
- controlles
```go
package admin

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

// 控制器继承
type BaseController struct {
}

func (b BaseController) Success(context *gin.Context) {
	context.String(http.StatusOK, "success")
}

func (b BaseController) Error(context *gin.Context) {
	context.String(http.StatusBadRequest, "error")
}
```
```go
package admin

import (
	"github.com/gin-gonic/gin"
)

type IndexController struct {
	BaseController
}

func (receiver IndexController) Index(context *gin.Context) {
	//context.String(http.StatusOK, "admin-test")
	// 使用继承
	receiver.Success(context)
}
```

### 中间件
  - 中间是匹配路由前和匹配路由完成后执行的操作

```go
package main

import (
	"Gin-Note/routers"
	"fmt"
	"github.com/gin-gonic/gin"
	"time"
)

// 中间件
func initMiddlewareOne(context *gin.Context) {
	start := time.Now().UnixNano()
	fmt.Println("我先调用-initMiddlewareOne")

	// 调用该请求的剩余处理程序
	context.Next()

	end := time.Now().UnixNano()
	fmt.Println("我最后调用-initMiddlewareOne")

	fmt.Println("TimeOne: ", end-start)
}

func initMiddlewareTwo(context *gin.Context) {
	start := time.Now().UnixNano()
	fmt.Println("我先调用-initMiddlewareTwo")

	// 调用该请求的剩余处理程序
	context.Next()

	end := time.Now().UnixNano()
	fmt.Println("我最后调用-initMiddlewareTwo")

	fmt.Println("TimeTwo: ", end-start)
}

func main() {
	r := gin.Default()

	r.Static("/static", "./static")

	r.LoadHTMLGlob("templates/**/*")

	// 配置全局中间件
	r.Use(initMiddlewareOne, initMiddlewareOne)
	

	r.GET("/", initMiddlewareOne, func(context *gin.Context) {
		context.String(200, "123")
	})

	r.GET("/login", initMiddlewareOne, initMiddlewareTwo, func(context *gin.Context) {
		fmt.Println("登录")
		context.String(200, "login")
	})

	r.GET("/logout", func(context *gin.Context) {
		context.String(200, "logout")
	})

	r.Run(":8080")
}
```

- #### 路由里添加中间件

```go
package routers

import (
	"Gin-Note/controllers/index"
	"Gin-Note/middlewares"
	"github.com/gin-gonic/gin"
)

func DefaultRoutersInit(r *gin.Engine) {

	// 路由分组
	defaultRouters := r.Group("/", middlewares.InitMiddleware)
	// 路由组使用中间间
	defaultRouters.Use(middlewares.InitMiddleware)
	{
		// 自定义控制器抽离
		defaultRouters.GET("/", index.DefaultController{}.Index)
		defaultRouters.GET("/new", index.DefaultController{}.New)
	}
}
```
```go
package middlewares

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"time"
)

func InitMiddleware(context *gin.Context) {
	fmt.Println(time.Now())
}
```

- #### 中间件和控制器通信
```go
package middlewares

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"time"
)

func InitMiddleware(context *gin.Context) {
	fmt.Println(time.Now())
	context.Set("username", "admin")  // 设置传输数据
}
```

```go
package index

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
)

type DefaultController struct {
}

func (receiver DefaultController) Index(context *gin.Context) {
	context.HTML(http.StatusOK, "default/index.html", gin.H{})
	value, exists := context.Get("username") // 获取中间件设置的数据
	v, _ := value.(string)                   // 类型断言
	fmt.Println(value, exists, v)
}

func (receiver DefaultController) New(context *gin.Context) {
	context.String(http.StatusOK, "new")
}
```

- #### 中间件分组和协程不影响主程
```go
package middlewares

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"time"
)

func InitMiddleware(context *gin.Context) {
	// 定义goroutine统计日志
	cp := context.Copy()
	go func() {
		time.Sleep(2 * time.Second)
		fmt.Println("in path: ", cp.Request.URL.Path)
	}()
}
```

```go
package routers

import (
	"Gin-Note/controllers/index"
	"Gin-Note/middlewares"
	"github.com/gin-gonic/gin"
)

func DefaultRoutersInit(r *gin.Engine) {

	// 路由分组
	defaultRouters := r.Group("/", middlewares.InitMiddleware)
	// 路由组使用中间间
	defaultRouters.Use(middlewares.InitMiddleware)
	{
		// 自定义控制器抽离
		defaultRouters.GET("/", index.DefaultController{}.Index)
		defaultRouters.GET("/new", index.DefaultController{}.New)
	}
}
```

### 自定义Model

```go
package models

import (
	"time"
)

func UnixToTime(timestamp int) string {
	t := time.Unix(int64(timestamp), 0)
	return t.Format("2006-01-02 15:04:05")
}
```

### 文件上传

- #### 单文件和多文件

```go
package main

import (
	"Gin-Note/models"
	"Gin-Note/routers"
	"fmt"
	"github.com/gin-gonic/gin"
	"html/template"
	"log"
	"net/http"
	"path"
	"time"
)

func main() {
	r := gin.Default()

	r.Static("/static", "./static")
	
	// 单文件上传
	r.POST("/upload", func(context *gin.Context) {
		file, err := context.FormFile("file")
		// file.Filename 文件名称
		// 文件路径
		dst := path.Join("./static/upload", file.Filename) // ./static/upload/test.jpg
		if err != nil {
			log.Println(err)
		} else {
			// 上传文件
			context.SaveUploadedFile(file, dst)
			context.JSON(http.StatusOK, gin.H{
				"success": true,
				"dst":     dst,
			})
		}
	})

	// 多文件上传
	r.POST("/uploads", func(context *gin.Context) {
		file1, err1 := context.FormFile("file1")
		file2, err2 := context.FormFile("file2")
		// 文件路径
		dst1 := path.Join("./static/upload", file1.Filename)
		if err1 == nil {
			context.SaveUploadedFile(file1, dst1)
		}
		// 文件路径
		dst2 := path.Join("./static/upload", file2.Filename)
		if err2 == nil {
			context.SaveUploadedFile(file2, dst2)
		}
		context.JSON(http.StatusOK, gin.H{
			"success": http.StatusOK,
			"file1":   dst1,
			"file2":   dst2,
		})
	})

	// 相同名多文件上传
	r.POST("/uploadFile", func(context *gin.Context) {
		form, _ := context.MultipartForm()
		files := form.File["files[]"]
		for _, file := range files {
			dst := path.Join("./static/upload", file.Filename)
			context.SaveUploadedFile(file, dst)
		}
		context.JSON(http.StatusOK, gin.H{
			"success": http.StatusOK,
			"data":    [...]string{},
		})
	})

	r.Run(":8080")
}
```

- #### 按日期存储文件

```go
package main

import (
	"Gin-Note/models"
	"Gin-Note/routers"
	"fmt"
	"github.com/gin-gonic/gin"
	"html/template"
	"net/http"
	"os"
	"path"
	"strconv"
	"time"
)

func main() {
	r := gin.Default()

	r.Static("/static", "./static")
	

	r.POST("/upload", func(context *gin.Context) {
		// 获取上传文件
		file, err := context.FormFile("file")
		if err == nil {
			// 获取后缀名 判断类型是否正确 .jpg .png .gif .jpeg
			extName := path.Ext(file.Filename)
			allowExtMap := map[string]bool{
				".jpg":  true,
				".png":  true,
				".gif":  true,
				".jpeg": true,
			}
			if _, ok := allowExtMap[extName]; !ok {
				context.String(200, "上传的文件类型不合法")
				return
			}
			// 创建图片保存目录 static/upload/20221028
			day := time.Now().Format("20060102")
			dir := "./static/upload/" + day
			err := os.MkdirAll(dir, 0666)
			if err != nil {
				context.String(200, "创建目录失败")
				return
			}
			// 生成文件名称和文件保存的目录
			fileName := strconv.FormatInt(time.Now().Unix(), 10) + extName
			dst := path.Join(dir, fileName)
			// 执行上传
			context.SaveUploadedFile(file, dst)
			context.JSON(http.StatusOK, gin.H{
				"success": true,
				"dst":     dst,
			})
		}
	})

	r.Run(":8080")
}
```

### Cookie
  - 页面之间数据共享
```go
package index

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
)

type DefaultController struct {
}

func (receiver DefaultController) Index(context *gin.Context) {
	// 设置Cookie 参数: 属性 值 过期时间 域 域名 设置http/https 反正xss攻击
	context.SetCookie("username", "admin", 3600, "/", "localhost", false, false)
	// 删除Cookie
	//context.SetCookie("username", "admin", -1, "/", "localhost", false, false)

	context.HTML(http.StatusOK, "default/index.html", gin.H{})

}

func (receiver DefaultController) New(context *gin.Context) {
	// 获取Cookie
	cookie, _ := context.Cookie("username")
	context.String(http.StatusOK, cookie)
}
```

- #### 多个二级域名共享Cookie
  - 域名前面加个`.`
  - ```go
    context.SetCookie("username", "admin", 3600, "/", ".admin.com", false, false)
    
### Session
  - session是另一种记录客户状态的机制，不同的是Cookie保存在客户端浏览器中，而Session保存在服务器

- #### 安装
  - `go get github.com/gin-contrib/sessions`
  - `go get github.com/gin-contrib/sessions/cookie`

- #### 配置和使用

```go
package main

import (
	"Gin-Note/models"
	"Gin-Note/routers"
	"fmt"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"html/template"
	"time"
)

func main() {
	r := gin.Default()

	r.Static("/static", "./static")
	

	// 配置session中间件
	// 创建一个基于cookie的存储引擎，secret参数是用于加密的密钥
	store := cookie.NewStore([]byte("secret"))
	// store是前面创建的存储引擎，我们可以替换成其他存储引擎
	r.Use(sessions.Sessions("mysession", store))
	
	// 使用session
	r.GET("/session", func(context *gin.Context) {
		// 设置sessions
		session := sessions.Default(context)
		session.Set("username", "test")
		session.Save() // 设置session必须调用
	})
	r.GET("/getSession", func(context *gin.Context) {
		// 获取sessions
		session := sessions.Default(context)
		get := session.Get("username")
		context.String(200, "%v", get)
	})

	r.Run(":8080")
}
```

- #### 分布式Session

- ##### 安装redis
  - `https://github.com/tporadowski/redis/releases`

```go
package main

import (
	"Gin-Note/models"
	"Gin-Note/routers"
	"fmt"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/redis"
	"github.com/gin-gonic/gin"
	"html/template"
	"time"
)

func main() {
	r := gin.Default()
	

	r.Static("/static", "./static")

	// 配置session redis中间件
	store, _ := redis.NewStore(10, "tcp", "127.0.0.1:6379", "", []byte("secret"))
	// store是前面创建的存储引擎，我们可以替换成其他存储引擎
	r.Use(sessions.Sessions("mysession", store))

	// 使用session
	r.GET("/session", func(context *gin.Context) {
		// 设置sessions
		session := sessions.Default(context)
		// 配置session过期时间
		session.Options(sessions.Options{
			MaxAge: 3600*6,	// 单位是秒
		})
		session.Set("username", "test")
		session.Save() // 设置session必须调用
	})
	r.GET("/getSession", func(context *gin.Context) {
		// 获取sessions
		session := sessions.Default(context)
		get := session.Get("username")
		context.String(200, "%v", get)
	})

	r.Run(":8080")
}
```

### MySQL数据库

- #### MySQL常用命令
  - `mysql -uroot -p` 连接数据库
  - `show databases;` 查看当前连接的数据库
  - `use gin;` 使用数据库
  - `show tables;` 查看数据库表
  - `select * from users;` 查看表数据
  - `select id,name from users;` 根据字段查找数据
  - `select id,name from users where id=1;` 根据条件查找数据
  - `create database book;` 创建数据库
  - `create table types(id int(11), name varchar(255), number int(3));` 创建表
  - `describe types;` 查看表结构
  - `insert into types(id,name,number) values (1,"Func",1);` 添加数据
  - `update types set number=2 where name="Map";` 修改字段数据
  - `deleter from types where id=2;` 删除数据
  - `select * from types order by id asc;` 以id升序排序
  - `select * from types order by id desc;` 以id降序排序
  - `select * from types order by name desc;` 以name降序排序
  - `select * from types order by name asc;` 以name升序排序
  - `select * from types order by name desc,number asc;` 以name降序和number升序排序
  - `select count(1) from types;` 统计数量
  - `select * from types limit 2;` 查找两条数据
  - `select * from types limit 2,2;` 跳过2条查询2条数据
  - `drop table test;` 删除表
  - `drop database test;` 删除数据库

- #### MySQL关键字和基本操作
  - ##### MySQL字段类型
    - 整数型 `tinyint` `smallint` `mediumint` `int` `bigint`
    - 浮点型 `float` `double` `decimal`
    - 字符型 `char` `varchar`
    - 备注型 `tinytext` `text` `mediumtext` `longtext`
  - ##### 查询语句详解和IN OR AND BETWEEN
    - `select * from class;` 查询所有数据
    - `select name,score from class;` 只查找name,score的数据
    - `select * from class where score > 60;` 查找score大于60的数据
    - `select * from class where email is null;` 查找email为null的数据
    - `select * from class where email is null or email="";` 查找email为null或为""的数据
    - `select * from class where email is not null;` 查找email不为null的数据
    - `select * from class where score >= 60 and score <=90;` 查找score大于等于和60小于等于90的数据
    - `select * from class where score between 60 and 90;`
    - `select * from class where score not between 60 and 90;` 查找score不在大于等于和60小于等于90的数据
    - `select * from class where score=20 or score=30;` 查找score等于20或score等于30的数据
    - `select * from class where score in(20,80,90);` 查找score是20,80,90的数据
    - `select * from class where email like "%test%";` 模糊查找email
  - ##### 分组函数
    - `select avg(score) from class;` 求score平均值
    - `select count(score) from class;` 求score记录总数
    - `select max(score) from class;` 求score最大值
    - `select min(score) from class;` 求score最小值
    - `select sum(score) from class;` 求score总和
    - `select * from class where score in(select max(score) from class);` 查找score最大值且查找对应数据
    - `select * from class where score in(select min(score) from class);` 查找score最小值且查找对应数据
  - ##### 别名
    - `select id,name as n,email as e, score as s from class;`
    - `select min(score) as minscore from class;`

- #### MySQL数据库表关联查询
  - 表与表之间一般存在3种关系，一对一，一对多，多对多关系

- #### MySQL事务和锁定
  - 事务处理可以用来维护数据库的完整性，保证成批的SQL语句要么全部执行，要么全部不执行
    - `begin;` 开启事务
    - `update user set balance=balance-100 where id=1;`
    - `commit;` 提交事务
    - `rollback;` 事务回滚
  - 读锁
    - `lock table user read;` 添加user表为读锁
      - `insert into user(username) values("test2");`
      - `ERROR 1099 (HY000): Table 'user' was locked with a READ lock and can't be updated`
    - `unlock tables;` 释放锁
  - 写锁
    - 只有锁表的用户可以进行读写操作，其他用户不行
    - `lock table user write;` 添加user表为写锁
    - `unlock tables;` 释放锁

## gorm
```go
package admin
//增删改查
import (
	"Gin-Note/datastruct"
	"Gin-Note/models"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

// 结构体继承
type UserController struct {
}

func (c UserController) Index(context *gin.Context) {
	// 查询数据库所有数据
	user := []datastruct.User{}
	models.DB.Find(&user)
	context.JSON(http.StatusOK, gin.H{
		"result": user,
	})

	// 查询age大于20的用户
	//user := []datastruct.User{}
	//models.DB.Where("age>20").Find(&user)
	//context.JSON(http.StatusOK, gin.H{
	//	"result": user,
	//})
}

func (c UserController) Add(context *gin.Context) {
	// 添加数据
	user := datastruct.User{
		Username: "test3",
		Age:      27,
		Email:    "test@test.com",
		AddTime:  time.Now().Year(),
	}
	models.DB.Create(&user)
	context.JSON(http.StatusOK, gin.H{
		"result": user,
	})

}

func (c UserController) Edit(context *gin.Context) {
	// 更新数据
	user := datastruct.User{
		Id: 3,
	}
	models.DB.Find(&user).Updates(datastruct.User{
		Username: "ttttttttttt",
	})
	context.JSON(http.StatusOK, gin.H{
		"result": user,
	})
}

func (c UserController) Delete(context *gin.Context) {
	// 删除一条数据
	user := datastruct.User{
		Id: 1,
	}
	models.DB.Find(&user).Delete(&user)
	context.JSON(http.StatusOK, gin.H{
		"result": user,
	})
}
```

### 一、基础概念

ORM(Object Relational Mapping)，意思是对象关系映射。

数据库会提供官方客户端驱动，但是需要自己处理 SQL 和结构体的转换。

使用 ORM 框架让我们避免转换，写出一些无聊的冗余代码。理论上 ORM 框架可以让我们脱离 SQL，但实际上还是需要懂 SQL 才可以使用 ORM。

我本人是非常排斥使用 ORM 框架的，原因有两点。

一、不自由，我不能随心所欲的控制我的数据库。

二、性能差，比官方客户端驱动直接编写 SQL 的效率低 3-5 倍。

不过 ORM 也有很多优点，它可以在一定程度上让新手避免慢 SQL。

也有一些文章讨论过 ORM 的利弊。比如这篇：[orm_is_an_antipattern](https://link.juejin.cn?target=https%3A%2F%2Fseldo.com%2Fposts%2Form_is_an_antipattern%2F)。

总的来说，是否使用 ORM 框架取决于一个项目的开发人员组织结构。

老手渴望自由，新手需要规则。世界上新手多，老手就要做出一些迁就。

gorm 是一款用 Golang 开发的 orm 框架，目前已经成为在 Golang Web 开发中最流行的 orm 框架之一。本文将对 gorm 中常用的 API 进行讲解，帮助你快速学会 gorm。

除了 gorm，你还有其他选择，比如 [sqlx](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fjmoiron%2Fsqlx) 和 [sqlc](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fkyleconroy%2Fsqlc)。

### 二、连接 MySQL

gorm 可以连接多种数据库，只需要不同的驱动即可。官方目前仅支持 MySQL、PostgreSQL、SQlite、SQL Server 四种数据库，不过可以通过自定义的方式接入其他数据库。

下面以连接 mySQL 为例，首先需要安装两个包。

```go
go复制代码import (
    "gorm.io/driver/mysql" // gorm mysql 驱动包
	"gorm.io/gorm"// gorm
)
```

连接代码。

```go
go复制代码// MySQL 配置信息
username := "root"              // 账号
password := "xxxxxx" // 密码
host := "127.0.0.1"             // 地址
port := 3306                    // 端口
DBname := "gorm1"               // 数据库名称
timeout := "10s"                // 连接超时，10秒
dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8&parseTime=True&loc=Local&timeout=%s", username, password, host, port, DBname, timeout)
// Open 连接
db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
if err != nil {
    panic("failed to connect mysql.")
}
```

### 三、声明模型

每一张表都会对应一个模型（结构体）。

比如数据库中有一张 goods 表。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93769a276a494f28a31cde0b90f75529~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

```sql
sql复制代码CREATE TABLE `gorm1`.`无标题`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `price` decimal(10, 2) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;
```

那么就会对应如下的结构体。

```go
go复制代码type Goods struct {
    Id    int
    Name  string
    Price int
}
```

#### 约定

gorm 制定了很多约定，并按照约定大于配置的思想工作。

比如会根据结构体的复数寻找表名，会使用 ID 作为主键，会根据 CreateAt、UpdateAt 和 DeletedAt 表示创建时间、更新时间和删除时间。

gorm 提供了一个 Model 结构体，可以将它嵌入到自己的结构体中，省略以上几个字段。

```go
go复制代码type Model struct {
  ID        uint           `gorm:"primaryKey"`
  CreatedAt time.Time
  UpdatedAt time.Time
  DeletedAt gorm.DeletedAt `gorm:"index"`
}
```

嵌入到 goods 结构体中。

```go
go复制代码type Goods struct {
    gorm.Model
    Id    int
    Name  string
    Price int
}
```

这样在每次创建不同的结构体时就可以省略创建 ID、CreatedAt、UpdatedAt、DeletedAt 这几个字段。

#### 字段标签 tag

在创建模型时，可以给字段设置 tag 来对该字段一些属性进行定义。

比如创建 Post 结构体，我们希望 Title 映射为 t，设置最大长度为 256，该字段唯一。

```go
go复制代码type Post struct {
	Title string `gorm:"column:t, size:256, unique:true"`
}
```

等同于以下 SQL。

```sql
sql
复制代码CREATE TABLE `posts` (`t, size:256, unique:true` longtext)
```

更多功能可参照下面这张表。

| 标签名         | 说明                                                         |
| -------------- | ------------------------------------------------------------ |
| column         | 指定 db 列名                                                 |
| type           | 列数据类型，推荐使用兼容性好的通用类型，例如：所有数据库都支持 bool、int、uint、float、string、time、bytes 并且可以和其他标签一起使用，例如：`not null`、`size`, `autoIncrement`… 像 `varbinary(8)` 这样指定数据库数据类型也是支持的。在使用指定数据库数据类型时，它需要是完整的数据库数据类型，如：`MEDIUMINT UNSIGNED not NULL AUTO_INSTREMENT` |
| size           | 指定列大小，例如：`size:256`                                 |
| primaryKey     | 指定列为主键                                                 |
| unique         | 指定列为唯一                                                 |
| default        | 指定列的默认值                                               |
| precision      | 指定列的精度                                                 |
| scale          | 指定列大小                                                   |
| not null       | 指定列为 NOT NULL                                            |
| autoIncrement  | 指定列为自动增长                                             |
| embedded       | 嵌套字段                                                     |
| embeddedPrefix | 嵌入字段的列名前缀                                           |
| autoCreateTime | 创建时追踪当前时间，对于 `int` 字段，它会追踪时间戳秒数，您可以使用 `nano`/`milli` 来追踪纳秒、毫秒时间戳，例如：`autoCreateTime:nano` |
| autoUpdateTime | 创建/更新时追踪当前时间，对于 `int` 字段，它会追踪时间戳秒数，您可以使用 `nano`/`milli` 来追踪纳秒、毫秒时间戳，例如：`autoUpdateTime:milli` |
| index          | 根据参数创建索引，多个字段使用相同的名称则创建复合索引，查看 [索引](https://link.juejin.cn?target=https%3A%2F%2Fgorm.io%2Fzh_CN%2Fdocs%2Findexes.html) 获取详情 |
| uniqueIndex    | 与 `index` 相同，但创建的是唯一索引                          |
| check          | 创建检查约束，例如 `check:age > 13`，查看 [约束](https://link.juejin.cn?target=https%3A%2F%2Fgorm.io%2Fzh_CN%2Fdocs%2Fconstraints.html) 获取详情 |
| <-             | 设置字段写入的权限， `<-:create` 只创建、`<-:update` 只更新、`<-:false` 无写入权限、`<-` 创建和更新权限 |
| ->             | 设置字段读的权限，`->:false` 无读权限                        |
| -              | 忽略该字段，`-` 无读写权限                                   |

### 四、自动迁移

在数据库的表尚未初始化时，gorm 可以根据指定的结构体自动建表。

通过 `db.AutoMigrate` 方法根据 User 结构体，自动创建 user 表。如果表已存在，该方法不会有任何动作。

```go
go复制代码type User struct {
	gorm.Model
	UserName string
	Password string
}

db.AutoMigrate(&User{})
```

建表的规则会把 user 调整为复数，并自动添加 gorm.Model 中的几个字段。由于很多数据库是不区分大小写的，如果采用 camelCase 风格命名法，在迁移数据库时会遇到很多问题，所以数据库的字段命名风格都是采用 underscorecase 风格命名法，gorm 会自动帮我们转换。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/65542c9e87274e0393f388bb1832f730~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

等同于以下 SQL。

```sql
sql复制代码CREATE TABLE `gorm1`.`无标题`  (
  `id` bigint(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) NULL DEFAULT NULL,
  `updated_at` datetime(3) NULL DEFAULT NULL,
  `deleted_at` datetime(3) NULL DEFAULT NULL,
  `user_name` longtext CHARACTER SET utf8 COLLATE utf8_bin NULL,
  `password` longtext CHARACTER SET utf8 COLLATE utf8_bin NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_users_deleted_at`(`deleted_at`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;
```

### 五、创建数据 Craete Insert

使用 `db.Create` 方法，传入结构体的指针创建。

```go
go复制代码user := User{UserName: "l", Password: "ddd"}
result := db.Create(&user)
```

等同于以下 SQL。

```go
go复制代码INSERT INTO
    `users` ( `created_at`, `updated_at`, `deleted_at`, `user_name`, `password` )
VALUES
	(
		'2020-12-03 17:19:00.249',
		'2020-12-03 17:19:00.249',
		NULL,
	'l',
	'ddd')
```

*gorm 会自动维护 created_at、updated_ad 和 deleted_at 三个字段。*

#### 插入后返回的常用数据

下面是一些常用的插入数据。

```go
go复制代码fmt.Println("ID:", user.ID)                       // 插入的主键
fmt.Println("error:", result.Error)               // 返回的 error
fmt.Println("rowsAffected:", result.RowsAffected) // 插入的条数
```

#### 只插入指定字段

通过 Select 选择指定字段。

```go
go复制代码user := User{UserName: "lzq", Password: "ccc"}
result := db.Select("UserName").Create(&user)
```

等同于以下 SQL。

```sql
sql
复制代码INSERT INTO `users` (`user_name`) VALUES ('lzq')
```

_需要注意：使用 select 时不会自动维护 created_at、updated_ad 和 deleted_at。

#### 不插入指定字段

使用 Omit 方法过滤一些字段。

```go
go
复制代码result := db.Omit("UserName").Create(&user)
```

#### 批量插入

当需要批量插入时，传入一个切片即可。

```go
go复制代码users := []User{
    {UserName: "lzq", Password: "aaa"},
    {UserName: "qqq", Password: "bbb"},
    {UserName: "gry", Password: "ccc"},
}
db.Create(&users)
```

等同于以下 SQL。

```sql
sql复制代码INSERT INTO `users` ( `created_at`, `updated_at`, `deleted_at`, `user_name`, `password` )
VALUES
	( '2020-12-03 18:08:47.478', '2020-12-03 18:08:47.478', NULL, 'lzq', 'aaa' ),(
		'2020-12-03 18:08:47.478',
		'2020-12-03 18:08:47.478',
		NULL,
		'qqq',
		'bbb'
		),(
		'2020-12-03 18:08:47.478',
		'2020-12-03 18:08:47.478',
		NULL,
	'gry',
	'ccc')
```

#### 分批批量插入

在某些情况下，users 的数量可能非常大，此时可以使用 `CreateInBatches` 方法分批次批量插入。

假设有 6 条 user 数据，你想每次插入 2 条，这样就会执行 3 次 SQL。

```go
go复制代码users := []User{
    {UserName: "lzq", Password: "aaa"},
    {UserName: "qqq", Password: "bbb"},
    {UserName: "gry", Password: "ccc"},
    {UserName: "lzq", Password: "aaa"},
    {UserName: "qqq", Password: "bbb"},
    {UserName: "gry", Password: "ccc"},
}

db.CreateInBatches(&users, 2)
```

等同于依次执行以下 3 句 SQL。

```sql
sql复制代码INSERT INTO `users` ( `created_at`, `updated_at`, `deleted_at`, `user_name`, `password` )
VALUES
	( '2020-12-03 18:15:20.602', '2020-12-03 18:15:20.602', NULL, 'lzq', 'aaa' ),(
		'2020-12-03 18:15:20.602',
		'2020-12-03 18:15:20.602',
		NULL,
	'qqq',
	'bbb')
sql复制代码INSERT INTO `users` ( `created_at`, `updated_at`, `deleted_at`, `user_name`, `password` )
VALUES
	( '2020-12-03 18:15:20.616', '2020-12-03 18:15:20.616', NULL, 'gry', 'ccc' ),(
		'2020-12-03 18:15:20.616',
		'2020-12-03 18:15:20.616',
		NULL,
	'lzq',
	'aaa')
sql复制代码INSERT INTO `users` ( `created_at`, `updated_at`, `deleted_at`, `user_name`, `password` )
VALUES
	( '2020-12-03 18:15:20.621', '2020-12-03 18:15:20.621', NULL, 'qqq', 'bbb' ),(
		'2020-12-03 18:15:20.621',
		'2020-12-03 18:15:20.621',
		NULL,
		'gry',
	'ccc'
	)
```

`CreateInBatches` 方法的内部是使用 for 进行切割切片的，并没有使用 goroutine。

### 六、查询数据 Read Selete

#### 查询单个对象

gorm 提供了 First、Take、Last 方法。它们都是通过 `LIMIT 1` 来实现的，分别是主键升序、不排序和主键降序。

```go
go复制代码user := User{}

// 获取第一条记录（主键升序）
db.First(&user)
// SELECT * FROM users ORDER BY id LIMIT 1;

// 获取一条记录，没有指定排序字段
db.Take(&user)
// SELECT * FROM users LIMIT 1;

// 获取最后一条记录（主键降序）
db.Last(&user)
// SELECT * FROM users ORDER BY id DESC LIMIT 1;
```

如果没有查询到对象，会返回 ErrRecordNotFound 错误。

```go
go复制代码result := db.First(&user)
errors.Is(result.Error, gorm.ErrRecordNotFound)
result.RowsAffected
```

#### 根据主键查询

在 First/Take/Last 等函数中设置第二个参数，该参数被认作是 ID。可以选择 int 或 string 类型。

```go
go复制代码db.First(&user, 10)

db.First(&user, "10")
```

*选择 string 类型的变量时，需要注意 SQL 注入问题。*

#### 查询多个对象（列表）

使用 Find 方法查询多个对象。

```go
go复制代码users := []User{}
result := db.Find(&users)
```

返回值会映射到 users 切片上。

依然可以通过访问返回值上的 Error 和 RowsAffected 字段获取异常和影响的行号。

```go
go复制代码result.Error
result.RowsAffected
```

#### 设置查询条件 Where

gorm 提供了万能的 Where 方法，可以实现 =、<>、IN、LIKE、AND、>、<、BETWEEN 等方法，使用 ? 来占位。

```go
go复制代码db.Where("name = ?", "l").First(&user)
// SELECT * FROM users WHERE user_name = 'l' ORDER BY id LIMIT 1;

// 获取全部匹配的记录
db.Where("name <> ?", "l").Find(&users)
// SELECT * FROM users WHERE user_name <> 'l';

// IN
db.Where("name IN ?", []string{"lzq", "qqq"}).Find(&users)
// SELECT * FROM users WHERE user_name IN ('lzq','qqq');

// LIKE
db.Where("name LIKE ?", "%l%").Find(&users)
// SELECT * FROM users WHERE user_name LIKE '%l%';

// AND
db.Where("name = ? AND age = ?", "lzq", "aaa").Find(&users)
// SELECT * FROM users WHERE user_name = 'lzq' AND password = aaa;

// BETWEEN
db.Where("created_at BETWEEN ? AND ?", lastWeek, today).Find(&users)
// SELECT * FROM users WHERE created_at BETWEEN '2020-11-01 00:00:00' AND '2020-11-08 00:00:00';
```

#### Where 快速设置条件的方法

传递 Struct、Map 和 切片时，可以实现更简便的设置条件。

```go
go复制代码db.Where(&User{UserName:"lzq", Password:"aaa"}).Find(&user)
db.Where(map[string]interface{}{"user_name": "lzq", "password": "aaa"}).Find(&user)
```

结构体和 Map 的效果几乎是相等的。

```sql
sql复制代码SELECT
	*
FROM
	`users`
WHERE
	`users`.`user_name` = 'lzq'
	AND `users`.`password` = 'aaa'
	AND `users`.`deleted_at` IS NULL
```

两者唯一的不同之处在于 struct 中的零值字段不会查询。比如 0、""、false。

切片是查询主键。

```go
go
复制代码db.Where([]int{10, 11}).Find(&user)
```

等同于如下 SQL。

```sql
sql复制代码SELECT
	*
FROM
	`users`
WHERE
	`users`.`id` IN ( 10, 11 )
	AND `users`.`deleted_at` IS NULL
```

所有的查询，gorm 都会默认设置 `tabel.deleted_at IS NULL` 查询条件。

除了 Where 方法外，还有内联查询的方式，但是不推荐同时使用两种风格。

```go
go复制代码db.Find(&user, "user_name = ?", "lzq")
// SELECT * FROM users WHERE user_name = "lzq";
```

#### 其他查询 Not & Or

gorm 还提供了 Not 和 Or 方法，但不推荐使用，因为 Where 同样可以实现两者的功能，记忆额外的 API 无疑会增加心智负担。

```go
go
复制代码db.Where("password = ?", "aaa").Not("user_name", "l").Or("id > ?", 10).Find(&users)
```

等同于如下 SQL。

```sql
sql复制代码SELECT * FROM `users` WHERE (( PASSWORD = 'aaa' )
	AND `user_name` <> 108
	OR id > 10
)
AND `users`.`deleted_at` IS NULL
```

#### 选取特定字段 Select

使用 Select 方法。

```go
go
复制代码db.Select("password").Where(&User{UserName:"lzq"}).Find(&user)
```

等同于以下 SQL。

```sql
sql复制代码SELECT
	`password`
FROM
	`users`
WHERE
	`users`.`user_name` = 'lzq'
	AND `users`.`deleted_at` IS NULL
```

#### 其他操作

##### 排序 Order

```go
go
复制代码db.Order("user_name desc, password").Find(&users)
```

等同于以下 SQL。

```sql
sql复制代码SELECT
	*
FROM
	`users`
WHERE
	`users`.`deleted_at` IS NULL
ORDER BY
	user_name DESC,
PASSWORD
```

##### 分页 Limit Offset

Limit 和 Offset 可以单独使用，也可以组合使用。

```go
go复制代码db.Limit(3).Find(&users)
db.Offset(3).Find(&users)

db.Limit(2).Offset(3).Find(&users)
```

等同于以下 SQL。

```sql
sql复制代码SELECT
	*
FROM
	`users`
WHERE
	`users`.`deleted_at` IS NULL
	LIMIT 2 OFFSET 3
```

##### 分组 Group Having

根据 username 统计用户名的重复。

```go
go复制代码result := []map[string]interface{}{}
db.Model(&User{}).
  Select("user_name, SUM( id ) AS nums").
  Group("user_name").
  Find(&result)
```

等同于以下 SQL。

```sql
sql复制代码SELECT
	user_name,
	SUM( id ) AS nums
FROM
	users
GROUP BY
	user_name;
```

##### 去重 Distinct

```go
go复制代码result := []string{}
db.Model(&User{}).
  Distinct("user_name").
  Find(&result)
```

等同于以下 SQL。

```sql
sql复制代码SELECT DISTINCT
	user_name
FROM
	users
```

##### 连表 Join

在业务中不太建议使用 Join，而是使用多条查询来做多表关联。

### 七、更新数据 Update

#### 更新所有字段

使用 Save 方法更新所有字段，即使是零值也会更新。

```go
go复制代码db.First(&user)
user.UserName = ""
db.Save(&user)
```

等同于以下 SQL。

```sql
sql复制代码UPDATE `users`
SET `created_at` = '2020-12-03 15:12:08.548',
`updated_at` = '2020-12-04 09:17:40.891',
`deleted_at` = NULL,
`user_name` = '',
`password` = 'ddd'
WHERE
	`id` = 1
```

#### 更新单列

使用 Model 和 Update 方法更新单列。

可以使用结构体作为选取条件，仅选择 ID。

```go
go复制代码user.ID = 12
db.Model(&user).Update("user_name", "lzq")
```

等同于以下 SQL。

```sql
sql复制代码UPDATE `users`
SET `user_name` = 'lzq',
`updated_at` = '2020-12-04 09:16:45.263'
WHERE
	`id` = 12
```

也可以在 Model 中设置空结构体，使用 Where 方法自己选取条件。

```go
go
复制代码db.Model(&User{}).Where("user_name", "gry").Update("user_name", "gry2")
```

等同于以下 SQL。

```sql
sql复制代码UPDATE `users`
SET `user_name` = 'gry2',
`updated_at` = '2020-12-04 09:21:17.043'
WHERE
	`user_name` = 'gry'
```

还可以组合选取条件。

```go
go复制代码user.ID = 20
db.Model(&user).Where("username", "gry").Update("password", "123")
```

等同于以下 SQL。

```sql
sql复制代码UPDATE `users`
SET `password` = '123',
`updated_at` = '2020-12-04 09:25:30.872'
WHERE
	`username` = 'gry'
	AND `id` = 20
```

#### 更新多列

使用 Updates 方法进行更新多列。支持 struct 和 map 更新。当更新条件是 struct 时，零值不会更新，如果确保某列必定更新，使用 Select 选择该列。

#### 更新选定字段 Selete Omit

使用 Select 和 Omit 方法。

#### 批量更新

如果在 Model 中没有设置 ID，默认是批量更新。

### 八、删除数据 Delete

#### 删除单条

使用 Delete 方法删除单条数据。但需要指定 ID，不然会批量删除。

```go
go复制代码user.ID = 20
db.Delete(&user)
```

等同于以下 SQL。

```sql
sql复制代码UPDATE `users`
SET `deleted_at` = '2020-12-04 09:45:32.389'
WHERE
	`users`.`id` = 20
	AND `users`.`deleted_at` IS NULL
```

#### 设置删除条件

使用 Where 方法进行设置条件。

```go
go
复制代码db.Where("user_name", "lzq").Delete(&user)
```

等同于以下 SQL。

```sql
sql复制代码UPDATE `users`
SET `deleted_at` = '2020-12-04 09:47:30.544'
WHERE
	`user_name` = 'lzq'
	AND `users`.`deleted_at` IS NULL
```

#### 根据主键删除

第二个参数可以是 int、string。使用 string 时需要注意 SQL 注入。

```go
go
复制代码db.Delete(&User{}, 20)
```

等同于以下 SQL。

```sql
sql复制代码UPDATE `users`
SET `deleted_at` = '2020-12-04 09:49:05.161'
WHERE
	`users`.`id` = 20
	AND `users`.`deleted_at` IS NULL
```

也可以使用切片 []int、[]string 进行根据 ID 批量删除。

```go
go
复制代码db.Delete(&User{}, []string{"21", "22", "23"})
```

等同于以下 SQL。

```sql
sql复制代码UPDATE `users`
SET `deleted_at` = '2020-12-04 09:50:38.46'
WHERE
	`users`.`id` IN ( '21', '22', '23' )
	AND `users`.`deleted_at` IS NULL
```

#### 批量删除

空结构体就是批量删除。

#### 软删除（逻辑删除）

如果结构体包含 gorm.DeletedAt 字段，会自动获取软删除的能力。

在调用所有的 Delete 方法时，会自动变为 update 语句。

```sql
sql
复制代码UPDATE users SET deleted_at="2020-12-04 09:40" WHERE id = 31;
```

在查询时会自动忽略软删除的数据。

```sql
sql
复制代码SELECT * FROM users WHERE user_name = 'gry' AND deleted_at IS NULL;
```

#### 查询软删除的数据

使用 Unscoped 方法查找被软删除的数据。

```go
go
复制代码db.Unscoped().Where("user_name = gry").Find(&users)
```

#### 永久删除（硬删除 物理删除）

使用 Unscoped 方法永久删除数据。

```go
go复制代码user.ID = 14
db.Unscoped().Delete(&user)
```

### 九、原生 SQL

除了上面的封装方法外，gorm 还提供了执行原生 SQL 的能力。

#### 执行 SQL 并将结果映射到变量上

使用 Raw 方法配合 Scan 方法。

可以查询单条数据扫描并映射到结构体或 map 上。

```go
go复制代码db.
  Raw("SELECT id, record_id, user_name, password FROM users WHERE id = ?", 25).
  Scan(&user)
```

也可以映射到其他类型上。

```go
go复制代码var userCount int
db.
  Raw("SELECT count(id) FROM users").
  Scan(&userCount)
```

如果返回结果和传入的映射变量类型不匹配，那么变量的值不会有变化。

#### 只执行 SQL 不使用结果

使用 Exec 方法执行 SQL。

```go
go
复制代码db.Exec("UPDATE users SET password=? WHERE id = ?", "abcdefg", 22)
```

### 十、钩子 Hook

gorm 提供了 Hook 功能。可以在创建、查询、更新和删除之前和之后自动执行某些逻辑。

#### 创建

gorm 提供了 4 个创建钩子，BeforeCreate、AfterCreate 和 BeforeSave、AfterSave。

假设现在需要添加一个 RecordID，并且在每次创建时生成一个 16 位的 uuid。

```go
go复制代码type User struct {
	gorm.Model
	RecordID string
	UserName string
	Password string
}
```

除此之外，还希望在存储之前打印生成的 uuid，在存储之后打印创建后的 id。

实现方式就是给模型结构体 User 添加 BeforeCreate 和 AfterCreate 两个方法。

```go
go复制代码func (u *User) BeforeCreate(tx *gorm.DB) error {
	u.RecordID = uuid.New().String()
	fmt.Println("创建 User 开始，UUID 为：", u.RecordID)
	return nil
}

func (u *User) AfterCreate(tx *gorm.DB) error {
	fmt.Println("创建 User 完毕，ID 为：", u.ID)
	return nil
}
```

#### 更新

更新的 Hook 是 BeforeUpdate、AfterUpdate 和 BeforeSave、AfterSave，用法与创建一致。

#### 查询

查询的 Hook 是 AfterFind，用法与创建一致。

#### 删除

删除的 Hook 是 BeforeDelete 和 AfterDelete，用法与创建一致。

除了查询的 Hook 外，其他 Hook 都是在事务上运行的，一旦在函数中 return error 时，就会触发事务回滚。

### 十一、事务

事务保证了事务一致性，但会降低一些性能。gorm 的创建、修改和删除操作都在事务中执行。

如果不需要可以在初始化时禁用事务，可以提高 30% 左右的性能。

#### 全局关闭事务

```go
go复制代码db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
  SkipDefaultTransaction: true,
})
```

#### 会话级别关闭事务

```go
go复制代码tx := db.Session(&Session{SkipDefaultTransaction: true})
// 继续执行 SQL 时使用 tx 对象
tx.First(&user)
```

#### 在事务中执行 SQL

假设现在需要添加一个 company 表存储公司信息，并创建一个 company_users 表用于关联用户和公司的信息。

```go
go复制代码// 创建结构体
type Company struct {
	gorm.Model
	RecordID string
	Name     string
}

type CompanyUser struct {
	gorm.Model
	RecordID  string
	UserID    string
	CompanyID string
}

// 自动迁移
db.AutoMigrate(&Company{})
db.AutoMigrate(&CompanyUser{})

// 创建一家公司
company := Company{Name: "gxt"}
company.RecordID = uuid.New().String()
db.Save(&company)

// 在事务中执行
db.Transaction(func(tx *gorm.DB) error {
    // 创建用户
    u := User{UserName: "ztg", Password: "333"}
    result := tx.Create(&u)
    if err := result.Error; err != nil {
        return err
    }
    // 查询公司信息
    company2 := Company{}
    tx.First(&company2, company.ID)
    // 关联用户和公司
    result = tx.Create(&CompanyUser{UserID: u.RecordID, CompanyID: company2.RecordID})
    if err := result.Error; err != nil {
        return err
    }
    return nil
})
```

### 十二、日志

gorm 默认实现了一个 Logger，它仅输出慢 SQL。

```go
go复制代码newLogger := logger.New(
    log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
    logger.Config{
        SlowThreshold: time.Second, // 慢 SQL 阈值
        LogLevel:      logger.Info, // Log level
        Colorful:      false,       // 禁用彩色打印
    },
)
```

日志的级别可以配置，可以设置 `Silent`、`Error`、`Warn`、`Info`。

#### 全局模式开启

```go
go复制代码db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
  Logger: newLogger,
})
```

#### 会话模式开启

```go
go
复制代码tx := db.Session(&Session{Logger: newLogger})
```

#### 自定义 Logger

gorm 提供了一个 Interface 接口，可以通过实现这个接口来自定义 Logger。

```go
go复制代码type Interface interface {
	LogMode(LogLevel) Interface
	Info(context.Context, string, ...interface{})
	Warn(context.Context, string, ...interface{})
	Error(context.Context, string, ...interface{})
	Trace(ctx context.Context, begin time.Time, fc func() (string, int64), err error)
}
```



作者：代码与野兽
链接：https://juejin.cn/post/6903337526811951118
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

## context

在Go语言并发编程中，用一个goroutine来处理一个任务，而它又会创建多个goroutine来负责不同子任务的场景非常常见。如下图

![img](https://imgs.itxueyuan.com/720430-20210114141751483-884839201.png)

这些场景中，往往会需要在API边界之间以及过程之间传递截止时间、取消信号或与其它请求相关的数据

![img](https://imgs.itxueyuan.com/720430-20210114141825980-1951960722.png)

谁是性能卡点呢？得通知它们任务取消了。

这时候就可以使用`Context`了。context包在Go1.7的时候被加入到官方库中。

context包的内容可以概括为，一个接口，四个具体实现，还有六个函数。

![img](https://imgs.itxueyuan.com/720430-20210114141813698-554893972.png)

Context接口提供了四个方法，下面是Context的接口

```go
type Context interface {
	Deadline() (deadline time.Time, ok bool)
	Done() <-chan struct{}
	Err() error
	Value(key interface{}) interface{}
}
```

#### emptyCtx类型

emptyCtx本质上是一个整型, *emptyCtx对Context接口的实现，只是简单的返回nil，false，实际上什么也没做。如下代码所示：

```go
type emptyCtx int

func (*emptyCtx) Deadline() (deadline time.Time, ok bool) {
	return
}

func (*emptyCtx) Done() <-chan struct{} {
	return nil
}

func (*emptyCtx) Err() error {
	return nil
}

func (*emptyCtx) Value(key interface{}) interface{} {
	return nil
}
```

Background和TODO这两个函数内部都会创建emptyCtx

```go
var (
	background = new(emptyCtx)
	todo       = new(emptyCtx)
)

func Background() Context {
	return background
}

func TODO() Context {
	return todo
}
```

其中Background主要用于在初始化时获取一个Context(从代码中可知本质是一个*emptyCtx，而emptCtx本质上是一个Int)，这就是Background()函数返回的变量结构。

而TODO()函数，官方文档建议在本来应该使用外层传递的ctx而外层却没有传递的地方使用，就像函数名称表达的含义一样，留下一个TODO。

#### cancelCtx类型

再来看cancelCtx类型，cancleCtx定义如下

```go
// cancelCtx可以被取消。 取消后，它也会取消所有实现取消方法的子级。
type cancelCtx struct {
	Context

	mu       sync.Mutex            // protects following fields
	done     chan struct{}         // created lazily, closed by first cancel call
	children map[canceler]struct{} // set to nil by the first cancel call
	err      error                 // set to non-nil by the first cancel call
}

func (c *cancelCtx) Value(key interface{}) interface{} {
	if key == &cancelCtxKey {
		return c
	}
	return c.Context.Value(key)
}

func (c *cancelCtx) Done() <-chan struct{} {
	c.mu.Lock()
	if c.done == nil {
		c.done = make(chan struct{})
	}
	d := c.done
	c.mu.Unlock()
	return d
}

func (c *cancelCtx) Err() error {
	c.mu.Lock()
	err := c.err
	c.mu.Unlock()
	return err
}
```

这是一种可取消的Context，done用于获取该Context的取消通知，children用于存储以当前节点为根节点的所有可取消的Context，以便在根节点取消时，可以把它们一并取消，err用于存储取消时指定的错误信息，而这个mu就是用来保护这几个字段的锁，以保障cancelCtx是线程安全的。

而WithCancel函数，可以把一个Context包装为cancelCtx，并提供一个取消函数，调用它可以Cancel对应的Context

```go
func WithCancel(parent Context) (ctx Context, cancel CancelFunc) {
	if parent == nil {
		panic("cannot create context from nil parent")
	}
	c := newCancelCtx(parent)
	propagateCancel(parent, &c)
	return &c, func() { c.cancel(true, Canceled) }
}
```

示例代码：

```go
ctx := context.Background()
ctx1, cancel := context.WithCancel(ctx)
```

![img](https://imgs.itxueyuan.com/720430-20210114141902131-1957228022.png)

#### timerCtx类型

再来看timerCtx,timerCtx定义如下

```go
type timerCtx struct {
	cancelCtx
	timer *time.Timer // Under cancelCtx.mu.

	deadline time.Time
}
```

它在cancelCtx的基础上，又封装了一个定时器和一个截止时间，这样既可以根据需要主动取消，也可以在到达deadline时，通过timer来触发取消动作。

要注意，这个timer也会由cancelCtx.mu来保护，确保取消操作也是线程安全的。

通过WithDeadline和WithTimeout函数，都可以创建timerCtx，区别是WithDeadline函数需要指定一个时间点，而WithTimeout函数接收一个时间段。

接下来，我们基于ctx1构造一个timerCtx

```go
ctx := context.Background()
ctx1, cancel := context.WithCancel(ctx)

deadline := time.Now().Add(time.Second)
ctx2, cancel := context.WithDeadline(ctx1, deadline)
```

![img](https://imgs.itxueyuan.com/720430-20210114141914061-488782751.png)

这个定时器会在deadline到达时，调用cancelCtx的取消函数，现在可以看到ctx2是基于ctx1创建的，而ctx1又是基于ctx创建的，基于每个Context可以创建多个Context，这样就形成了一个Context树，每个节点都可以有零个或多个子节点，可取消的Context都会被注册到离它最近的、可取消的祖先节点中。对ctx2来说离它最新的、可取消的祖先节点是ctx1

![img](https://imgs.itxueyuan.com/720430-20210114141922330-1299247475.png)

所以在ctx1这里的children map中，会增加ctx2这组键值对

![img](https://imgs.itxueyuan.com/720430-20210114141946356-49764307.png)

如果ctx2先取消，就只会影响到以它为根节点的Context，而如果ctx1先取消，就可以根据children map中的记录，把ctx1子节点中所有可取消的Context全部Cancel掉。

最后来看valueCtx类型

#### valueCtx类型

首先来看valueCtx的定义

```go
type valueCtx struct {
	Context
	key, val interface{}
}
```

它用来支持键值对打包，WithValue函数可以给Context附加一个键值对信息，这样就可以通过Context传递数据了

```go
var keyA string = "keyA"
ctx := context.Background()
ctxA := context.WithValue(ctx, keyA, "valA")
```

现在我们给ctx附加一个键值对keyA=>valA，变量ctxA也是Context接口类型，动态类型为*valueCtx，data指向一个valueCtx结构体，第一个字段是它的父级Context，key和val字段都是空接口类型，keyA的动态类型为string，动态值是string类型的变量keyA，val的动态类型同样是string，动态值为valA，

![img](https://imgs.itxueyuan.com/720430-20210114141956662-1690758359.png)

下面我们再基于ctxA，附加一个key相等但val不相等的键值对keyA=>eggo，ctxC的动态值指向这样一个valueCtx，父级Context自然是ctxA，key与ctxA中的相同，但是val的值与ctxA中的不相等

![img](https://imgs.itxueyuan.com/720430-20210114142004572-515925435.png)

通过ctxC获取kyA和keyC对应的值时会发现keyC覆盖了keyA对应的val，要找到原因，就要先看看Value方法是怎么工作的

```go
func (c *valueCtx) Value(key interface{}) interface{} {
	if c.key == key {
		return c.val
	}
	return c.Context.Value(key)
}
```

首先它会比较当前Context中的key是否等于要查找的key，因为keyA等于keyC，所以对keyA的查找会直接锁定到ctxC这里的val，因而出现了子节点覆盖父节点数据的情况，为了规避这种情况，最好不要直接使用string、int这些基础类型作为Key，而是用自定义类型包装一下，就像下面这样，把keyA定义为keytypea类型，keyC定义为keytypec类型，这样再次通过ctxC获取keyA时，因为key的类型不相同，第一步key相等性比较不通过，就会委托父节点继续查找，进而找到正确的val

![img](https://imgs.itxueyuan.com/720430-20210114142015342-1043525441.png)

所以说valueCtx之间通过Context字段形成了一个链表结构，使用Context传递数据时还要注意，Context本身本着不可改变(immutable)的模式设计的，所以不要试图修改ctx里保存的值，在http、sql相关的库中，都提供了对Context的支持，方便我们在处理请求时，实现超时自动取消，或传递请求相关的控制数据等等

![img](https://imgs.itxueyuan.com/720430-20210114142021476-1290724011.png)

了解了context包中，一个接口，四种具体实现，以及六个函数的基本情况，有助于我们理解Context的工作原理

![img](https://imgs.itxueyuan.com/720430-20210114142028388-1351873889.png)

[context源码](https://github.com/golang/go/blob/master/src/context/context.go)

[幼麟实验室](https://space.bilibili.com/567195437/)