package reference_backend.authz

default allow = false

allow {
	input.path[0] == "resource"
	user_is_owner
}

allow {
	input.path[0] == "resource"
	user_has_delegation
}

user_is_owner {
	nationalId := input.path[1]
	nationalId == input.natreg
}

user_has_delegation {
	nationalId := input.path[1]
	delegation := data.delegations[input.natreg]
    delegation.has_delegation_from[nationalId].scope == scope(input.method)
}

scope(m) = x {
	scope := {"GET": "read", "POST": "write"}
    x := scope[m]
}
