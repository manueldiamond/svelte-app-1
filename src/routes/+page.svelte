<script lang="ts">
    import {SortableList,UserLink,AddLink,name} from '$lib'
    import type { CustomParameters } from 'firebase/auth/web-extension';
    let demoLinks=[
            { id:'1', url: 'https://www.facebook.com', icon: 'facebook', title: 'Facebook Page' },
            { id:'2', url: 'https://www.whatsapp.com', icon: 'whatsapp', title: 'WhatsApp Chat' },
            { id:'3', url: 'https://twitter.com', icon: 'twitter', title: 'Twitter Profile' },
        ];
    const deleteLink=(e:CustomEvent)=>{
        const url = e.detail
        demoLinks=demoLinks.filter(link=>link.url!==url)
    }
    const sortList=(e:CustomEvent)=>{
        const sorted = e.detail
        demoLinks=sorted
    }
    const addLink=(event:CustomEvent)=>{
        const data = event.detail
        demoLinks=[...demoLinks, ({
            id:Date.now().toString(),
            ...data
        })]
    }

  let description = `${name} is a simple way to share multiple links.`;
  let keywords = "Linktree clone, multiple links, SvelteKit, Firebase, link management, user authentication";
  let author = "Manuel Diamond";
  let url = "https://linkflow.vercel.app"; 
</script>

<svelte:head>
  <title>{name}</title>
  <meta name="description" content={description}>
  <meta name="keywords" content={keywords}>
  <meta name="author" content={author}>
  <meta property="og:title" content={name}>
  <meta property="og:description" content={description}>
  <meta property="og:type" content="website">
  <meta property="og:url" content={url}>
  <meta property="og:image" content="https://i.ibb.co/tDT9qrt/img.png">
 
</svelte:head>

<main>
    <div class="min-h-screen flex flex-col smooth-scroll">
        <!-- Header Section -->
        <header class="text-white py-8">
          <div class="container mx-auto px-4">
            <h1 class="text-4xl font-bold text-center">Welcome to {name}</h1>
            <p class="text-lg text-center mt-4">A simple way to share multiple links in one place</p>
            <div class="flex justify-center mt-6 gap-2">
                <a href="#demo" class="btn">View Demo</a>
              <a href="/login" class="btn btn-primary">Get Started</a>
            </div>
          </div>
        </header>
    
        <section class="py-12">
          <article class="container mx-auto px-4">
            <h2 class="text-2xl font-bold mb-4">What is {name}?</h2>
            <p class="text-lg leading-relaxed mb-6">
                {name} is a customizable platform where you can showcase all your important links in one organized page. Whether it's your social media profiles, portfolio, blog, or anything else, {name} helps you share them efficiently.
            </p>   
          </article>
        </section>

        <section id='demo' class= 'bg-neutral py-10 w-full flex flex-col items-center gap-6'>
            <div class="px-4 w-80 mx-auto flex flex-col items-center gap-8"> 
                <h1 class="text-primary text-2xl my-6">@<span class="text-4xl">Your_Name</span></h1>
                <SortableList
                    list={demoLinks} 
                    on:sort={sortList}
                    let:item
                >
                    <div>
                        <UserLink editing on:delete={deleteLink} {...item}/>
                    </div>
                </SortableList>
              </div>
              {#if demoLinks.length<8}
                <AddLink on:add={addLink} demo/>
              {/if}
              <a href="/login" class="btn btn-primary">Share public link</a>
              
        </section>

        <footer class="bg-gray-800 text-white mt-auto py-8">
          <div class="container mx-auto px-4">
            <p class="text-lg text-center">&copy; 2024 <span class="uppercase">{name}</span>. Developed by Manuel D. <br><span class="italics text-sm text-slate-500">(ehm... I followd a tutorial so, I actually made this while learning Sveltekit)</span> <br>Built with SvelteKit, Tailwind CSS, DaisyUI and Firebase.</p>
          </div>
        </footer>
      </div>
</main>