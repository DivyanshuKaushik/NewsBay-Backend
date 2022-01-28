const jwt = require('jsonwebtoken')
exports.handler = async function (event) {
    try{
        const token = event.authorizationToken;
        const group = jwt.decode(token)['cognito:groups']
        if(!group){
            return generateAuthResponse('user', 'Deny', methodArn);
        }
    
        const methodArn = event.methodArn;
        let baseArn = "arn:aws:execute-api:ap-south-1:067691963636:d7unnt51ud/*/*/api/v2"
        // arn:aws:execute-api:ap-south-1:067691963636:d7unnt51ud/*/*/api/v2/articles

        const adminArn = "*"
        const editorArn = [baseArn.concat('/articles'),baseArn.concat('/getUnpublishedPosts'),baseArn.concat('/postStatus'),baseArn.concat('/deletePost')]
        const reporterArn = [baseArn.concat('/articles')]

        if(group.includes('admin')){
            return generateAuthResponse('admin', 'Allow', adminArn);
        }else if(group.includes("editor")){
            return generateAuthResponse('editor', 'Allow', editorArn);
        }else if(group.includes("reporter")){
            return generateAuthResponse('reporter', 'Allow', reporterArn);
        }else{
            return generateAuthResponse('user', 'Deny', methodArn);
        }
    
    }catch(err){
        return generateAuthResponse('user', 'Deny', methodArn);
    }
}

function generateAuthResponse(principalId, effect, methodArn) {
    const policyDocument = generatePolicyDocument(effect, methodArn);

    return {
        principalId,
        policyDocument
    }
}

function generatePolicyDocument(effect, methodArn) {
    if (!effect || !methodArn) return null

    const policyDocument = {
        Version: '2012-10-17',
        Statement: [{
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: methodArn
        }]
    };

    return policyDocument;
}