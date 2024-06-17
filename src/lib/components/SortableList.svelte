<script lang="ts">
    import type { UserLink } from '$lib/firebase';
    import { createEventDispatcher } from 'svelte';
    import {flip} from 'svelte/animate'
    
    export let list:any[]|undefined;

    let isOver:string|boolean=false;
    const dispatch = createEventDispatcher();
    const reorder = ({from,to}:any)=>{
        const newList=[...list!];
        newList[from]=[newList[to], (newList[to] = newList[from])] [0];

        dispatch('sort',newList)
    }

    function getDraggedParent(node:HTMLElement|EventTarget){
        let element:HTMLElement = (node as HTMLElement)
        if(!element.dataset?.index){
            return getDraggedParent(element.parentElement!);
        }else{
            return {...element.dataset}
        }
    }

    function onDragStart(e:DragEvent ){
        const dragged = getDraggedParent(e.target!);
        e.dataTransfer?.setData('dragfrom',dragged.index?.toString()!);
    }
    function onDragOver(e:DragEvent){
        const id = (e.target as HTMLElement).dataset.id;
        const dragged = getDraggedParent(e.target!);
        isOver = dragged?.id??false;
    }
    function onDragLeave(e:DragEvent){
        const dragged = getDraggedParent(e.target!);
        (isOver === dragged.id)&&(isOver=false)
    }
    function onDrop(e:DragEvent){
        isOver=false;
        const dragged = getDraggedParent(e.target!);
        reorder({
            from:e.dataTransfer?.getData('dragfrom'),
            to:dragged.index
        })
    }
    
</script>

{#if list?.length}
    <ul class="list flex gap-4 flex-col w-full">
        {#each list as item, index (item.id)}
            <li
                class=""
                class:over={item.id===isOver}
                data-index={index}
                data-id={item.id}
                
                draggable="true"
                on:dragstart={onDragStart}
                on:dragover|preventDefault={onDragOver}
                on:dragleave={onDragLeave}
                on:drop|preventDefault= {onDrop}
                animate:flip={{duration:300}}
            >
                <slot {item} {index} />
            </li>
        {/each}
    </ul>
{:else}
    <p class="mx-auto text-center">No Items</p>
{/if}