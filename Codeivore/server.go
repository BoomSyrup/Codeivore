package main

import (
   "net/http"
   "path"
   "path/filepath"
   "fmt"
   "os"
   "strings"
)

/*
To understand this server, I recommend that you go to func server and run
through all the functions
*/

func checkGet(w http.ResponseWriter, r *http.Request){
	if r.Method != "GET" {
		//If Request Method is not GET, return 405 Error
		http.Error(w, http.StatusText(405), 405)
		return //Else return and find the file requested
	}
}

func redirectHtml(w http.ResponseWriter, r *http.Request, servePath string) {
	//if the servePath (Request URL) ends with index or index.html
	if strings.HasSuffix(servePath, "index.html") ||
	strings.HasSuffix(servePath, "index"){
		//redirect to the folder so that processRequest can serve the
		//index.html without showing it on the address bar
		http.Redirect(w,r,"./",301)
		return
	}
	//if the servePath (Request URL) ends with .html
	if strings.HasSuffix(servePath, ".html") {
		//find the file name requested by servePath
		_, fileName := filepath.Split(servePath)
		//strip the .html from the file name
		servePath = "./" + strings.TrimSuffix(fileName,".html")
		fmt.Printf("Redirecting...\t%v\n",servePath)
		//redirect to the file requested without the .html extension
		http.Redirect(w,r,servePath,301)
		return
	}
}

func processRequest(w http.ResponseWriter, r *http.Request, servePath string){
	//os.Stat returns an err and the file given by the servePath. We need to see
	//if the file exists with or without the additional .html extension
	fileOriginal,_ := os.Stat(servePath);
	fileHtml,_ := os.Stat(servePath + ".html")
	//if we cannot find the file with AND without .html added, the file does not
	//exist so we return 404 Error
	if fileOriginal == nil && fileHtml == nil {
		http.Error(w,"404 not found",404)
		return
	//if we find the file with .html added, we add.html to the servePath
	//changing the servePath DOES NOT change the address bar, which is why
	//we had to redirect to change the address bar.
	} else if !(fileHtml == nil) {
		servePath += ".html"
	//if a folder was requested, return the index.html so you don't expose
	//directory
	}else if fileOriginal.IsDir(){
		servePath = filepath.Join(servePath, "index.html")	
	}
	fmt.Printf("Serving...\t%v\n",servePath)
	//if you could find the file without .html added, the condition falls
	//through and you can just serve the file, otherwise, the servePath
	//has been modified to serve the correct file 
	http.ServeFile(w,r,servePath)
	return
}

func server (w http.ResponseWriter, r *http.Request) {
	//We need to sanitize the request URL for security. Now called servePath
	servePath := path.Clean(r.URL.Path[1:])
	//We are makign a simple server that serves static files, any request that
	//is not making a GET request should return a 405 Error
	checkGet(w,r)
	/*
	The server removes /index.html and .html extensions from the address bar
	by redirecting the page, this gives users the ability to type the URL
	without needing to type .html at the end... There is a way around it
	https://www.alexedwards.net/blog/disable-http-fileserver-directory-listings
	However, this requires you to create a folder for every webpage. This 
	function makes it cleaner since you can have multiple html files in one
	folder. NOT ALL extensions are removed, just .html extensions
	*/
	redirectHtml(w,r,servePath)
	/*
	This function does 2 things:
	1. Serve the file if it is not a folder
	2. Serve the index.html of the folder if the input is a folder
	Serving the index.html of folders will stop users from seeing the directory
	*/
	processRequest(w,r,servePath)
}

func main() {
	http.HandleFunc("/", server)
    	http.ListenAndServe(":80", nil)
}
