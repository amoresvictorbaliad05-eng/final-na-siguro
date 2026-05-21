import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function EditProfile(){

const navigate=useNavigate();

const {
user,
updateProfile
}=useAuth();

const [form,setForm]=useState({

name:user?.name || "",

phone:user?.phone || "",

address:user?.address || ""

});

const handleSubmit=
async(e:any)=>{

e.preventDefault();

const result=
await updateProfile(form);

if(result.success){

alert(
"Profile updated"
);

navigate(
"/profile"
);

}else{

alert(
result.error
);

}

};

return(

<div className="max-w-lg mx-auto p-6">

<h1 className="text-2xl font-bold mb-6">

Edit Personal Information

</h1>

<form
onSubmit={handleSubmit}
className="space-y-4"
>

<input
className="w-full border p-3"

placeholder="Name"

value={form.name}

onChange={(e)=>
setForm({

...form,

name:e.target.value

})
}
/>

<input
className="w-full border p-3"

placeholder="Phone"

value={form.phone}

onChange={(e)=>
setForm({

...form,

phone:e.target.value

})
}
/>

<input
className="w-full border p-3"

placeholder="Address"

value={form.address}

onChange={(e)=>
setForm({

...form,

address:e.target.value

})
}
/>

<button
className="
w-full
bg-blue-600
text-white
p-3
rounded
"
>

Save Changes

</button>

</form>

</div>

);

}