const generateCode = (value) =>{
    value = value 
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f-]/g, "")
    .split(" ")
    .join("");
    
    let output = ''
    let merge = value + 'phongtro123'
    let length = merge.length
    // console.log('check',merge)
    for(let i = 0; i < 3; ++i){
        let index = Math.floor(length / 2)
        output += merge.charAt(index) 
        length = index
    }
    return `${value?.charAt(0)}${output}`.toUpperCase()
}
export default generateCode
