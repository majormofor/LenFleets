export function Picture({name,alt,width=1200,height=800,eager=false,sizes='(max-width: 760px) calc(100vw - 40px), (max-width: 1000px) 50vw, 33vw'}:{name:string;alt:string;width?:number;height?:number;eager?:boolean;sizes?:string}) {
 const variants=(ext:string)=>[480,800,1200].map(size=>`/images/${name}-${size}.${ext} ${size}w`).join(', ');
 return <picture><source type="image/avif" srcSet={variants('avif')} sizes={sizes}/><source type="image/webp" srcSet={variants('webp')} sizes={sizes}/><img src={`/images/${name}-800.webp`} alt={alt} width={width} height={height} loading={eager?'eager':'lazy'} fetchPriority={eager?'high':undefined} decoding="async"/></picture>;
}
