class validator{
    static validatorInfo(newsDetails){
        for(let i=0;i<newsDetails.length;i++){
            if(newsDetails[i].hasOwnProperty("category") && newsDetails[i].hasOwnProperty("country")){
                    let errorMsg = "";
                    if(newsDetails[i].category === '' || newsDetails[i].category === null){
                        errorMsg += "Category cannot be empty. ";
                    } 
                    if(newsDetails[i].country === '' || newsDetails[i].country === null){
                        errorMsg += "Country cannot be empty. ";
                    } 
                    if(errorMsg.length !== 0){
                        return {
                            "status": false,
                            "message": errorMsg
                        };
                    } else {
                        return {
                            "status": true,
                            "message": "News preference has been updated."
                        };
                    }
            }
            return {
                "status": false,
                "message": "Preference Info is malformed. Please provide all the properties."
            }
        }
    }
}

module.exports = validator;