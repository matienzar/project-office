package org.kyrian.model

import org.bson.types.ObjectId

class JiraServer {
    var id: ObjectId? = null;
    lateinit var url : String
    lateinit var instanceName:  String
    lateinit var userName: String
    lateinit var userPassword: String
    var active: Boolean = true
}