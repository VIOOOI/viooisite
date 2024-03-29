import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { BiSearch } from 'react-icons/bi'

import { Menu } from '../../components/menu'
import { Post } from '../../components/post'
import { Search } from '../../components/serch'

import { supabase } from '../../openDatabase'

export const Blog = () => {
	const [ isOpen, setOpen ] = useState(false)
	const [ posts, setPost ] = useState([])
	const [ value, setValue ] = useState('')
	const navigate = useNavigate();

	const toggleMenu = () => setOpen( !isOpen ) 

		const filterPosts =	posts.filter( post => {
			return post.title.toLowerCase().includes( value.toLowerCase() )
		} )

	useEffect( () => {
	}, [posts] )

	useEffect(() => {

		let mql = window.matchMedia('(max-width: 1024px)');
		if ( window.matchMedia('(max-width: 1024px)').matches ){
			navigate('/m/blog/')
		} else {
			( async function fethPost () {
				let { data: blog } = await supabase
					.from('blog')
					.select('id,title,description,created_at')
				setPost(blog)

			})();
		}

		document.title = "Блог";

	}, [])

	return (
		<> 
			<Menu isOpen={isOpen} setOpen={() => { toggleMenu() }} />
			

			<div className='flex'>
				<div className='w-4/12 min-h-screen overflow-y-scroll flex flex-col gap-5 px-5 pl-24 pt-10'>
					<Search value={value} setValue={setValue} filterPosts={filterPosts} />

					{
					filterPosts.map( post => {
						// let data = new Date(post.created_at)
						async function fethTags ( id ) {
							let { data: tags_blogs } = await supabase
								.from('tags_blogs')
								.select('tags,blogs')
								.eq('blogs', `${id}`)
							return tags_blogs
						}
						let tags = fethTags(post.id)
						return(
							<Post key={post.id} id={post.id} date={post.created_at} title={post.title} description={post.description} tags={tags} />
						)
					} )
					}

				</div>
				<div className='w-8/12 min-h-screen bg-site-100'>
					<Outlet />
				</div>
			</div>

		</>
	)
}
