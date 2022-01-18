exports.handler = async function (event) {
    const token = event.authorizationToken.toLowerCase();
    const methodArn = event.methodArn;

    // const adminArn = "*"
    // const editorArn = []
    // const reporterArn = []

    switch (token) {
        case 'admin':
            return generateAuthResponse('admin', 'Allow', methodArn);
        case 'editor':
            return generateAuthResponse('editor', 'Allow', methodArn);
        case 'reporter':
            return generateAuthResponse('editor', 'Allow', methodArn);
        default:
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