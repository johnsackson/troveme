//Config values for CRM stage filter and URL
var apiBaseURL = "http://localhost:8180/api/"

var apiTutorDirURL = apiBaseURL + "TutorDirectory/";
var apiSalesURL = apiBaseURL + "SalesActivity/";
var apiSalesGurgaonURL = apiBaseURL+ "SalesActivity/";

var initialFecthURL = apiTutorDirURL + "/SearchTutors?latitude=12.9715987&longitude=77.59456269999998&searchradius=100000";
var fetchURL = apiTutorDirURL + "/SearchTutorsInBoundaryAllStages";
var profileImgURL = apiTutorDirURL + "/ProfileImage?tutorId=";

var contactURL = apiSalesURL + "/CreateLeadMultipleEnquires";

var classes = "4,5,6,7,8,9,10,11";
var boards = "KAStateBoard,CBSE,ICSE";
var subjects = "Physics,Chemistry,Maths,Biology";