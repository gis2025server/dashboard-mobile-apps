build me dashboard monitoring, controling and reporting with login menu (web base)
build me apps (android & ios) and must be connect & live sysncronize with dashboard and database

menu login
username : "admin-gis" make (default)
password : "gis2026" make (default)
add feature for menu login :
-add, delete, edit,access 
-save, if success will be save and go to main dashboard and if fail please give the reason
-save database with name file "menulogin.db"

main dashboard 
- data user
- data outlet
- schedule visit md
- schedule visit sales area
- start visit md
- start visit sales
- report

main dashboard
- show with graph for global data "data user","data outlet","visit md","visit sales"
- data must be actual from apps install user

menu data user
- all data user save on database with file name "datauser.db"
- field datauser.db (username,nama,jabatan,amo,warehouse)
- only admin access can add,delete,edit,save
- if admin was fill data and click save button data will be save on datauser.db and return to new form, fail show the problems
- add exit button and will go the main dashboard display
- add feature upload for file excel(.xlsx) with same template on database "datauser.db". data excel was upload and success will be syncronize and fill the the datauser.db

menu data outlet 
- all data outlet save on database with file name "dataoutlet.db"
- field dataoutlet.db (username,amo,warehouse,idoutlet, namaoutlet,alamatoutlet,latitude,longtitude)
- only admin access can add,delete,edit,save
- if admin was fill data and click save button data will be save on dataoutlet.db and return to new form, if fail show the problems
- add exit button and will go the main dashboard display
- add feature upload for file excel(.xlsx) with same template on database "dataoutlet.db". data excel was upload and success will be syncronize and fill the the dataoutlet.db

menu schedule visit md
- all data outlet save on database with file name "datavisitmd.db"
- field datavisitmd.db (username,amo,warehouse,idoutlet, namaoutlet,datevisit)
- only admin access can add,delete,edit,save
- if admin was fill data and click save button data will be save on datavisitmd.db and return to new form, if fail show the problems
- add exit button and will go the main dashboard display
- add feature upload for file excel(.xlsx) with same template on database "datavisitmd.db". data excel was upload and success will be syncronize and fill the the datavisitmd.db

menu schedule visit sales
- all data outlet save on database with file name "datavisitsales.db"
- field datavisitsales.db (username,amo,warehouse,idoutlet, namaoutlet,datevisit)
- only admin access can add,delete,edit,save
- if admin was fill data and click save button data will be save on datavisitsales.db and return to new form, if fail show the problems
- add exit button and will go the main dashboard display
- add feature upload for file excel(.xlsx) with same template on database "datavisitsales.db". data excel was upload and success will be syncronize and fill the the datavisitsales.db

menu start visit 
- add field "start visit" - user must be fill date
- add field "username" - user must be fill ( look up from database file "datavisitmd" or "datavisitsales" )
- if the answer from start visit and username was same with database, dashboard or apps will show all data visit by date and username
- add field start button in each data dasboard or apps shown
  if user click start will be show form action with field
	- id outlet 		= look from dataoutlet.db
	- nama md 		= look from datauser.db
	- nama outlet		= look from dataoutlet.db
	- alamat outlet		= look from dataoutlet.db
	- show maps		= look latitude and longtitude from dataoutlet.db
	- add button check in 	= user must click check in first (apps will be read gps on device and will be save latitude and longtitude on database), if user did not click user can not take dokumentasi before and dokumentasi after dan status 
	- dokumentasi before	= add feature upload image from galery device or camera device from phone user
	- dokumentasi after	= add feature upload image from galery device or camera device from phone user
	- status posm		= user must be fill with dropdown choice ("terpasang", "outlet tidak ada", "toko tutup")
	- add button check out 	= user must clik check out first and after user click will be shown data for next visit and all data from form action will be save on database with name "visitaction.db" 
- add exit button for back to main dashboard

menu report
- show report daily, item will show : username, nama md, amo, warehouse, idoutlet, namaoutlet, dokumentasi before, dokumentasi after, status posm
- add feature download report ( report will be shown in excel )
- add exit button for back to main dashboard 

database 
- all database must be connected and relevan with dashboard and apps with actual and live
